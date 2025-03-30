// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/ERC405.sol";
// 创建一个简单的 ERC404 实现用于测试
contract TestERC405 is ERC405 {
    
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 frozenTime_
    ) ERC405(name_, symbol_, decimals_, frozenTime_) {}

    // 实现必需的 tokenURI 函数
    function tokenURI(uint256) public pure override returns (string memory) {
        return "test-uri";
    }

    // 添加公共铸造函数用于测试
    function mint(address to, uint256 value) public {
        _mintERC20(to, value);
    }
}

contract ERC405Test is Test {

    // struct TokenDeposit {
    //     address tokenAddress;
    //     uint256 amount;
    // }

    event ApprovalFailed(string message);
    event ApprovalSuccess(string message);
    event SetExemptFailed(string message);
    event SetExemptSuccess(string message);
 
    TestERC405 public token;
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    uint8 public constant DECIMALS = 18;
    uint256 public constant FROZEN_TIME = 1 days;
    uint256 public constant UNIT = 10 ** DECIMALS;

    function setUp() public {
        // 部署测试合约
        token = new TestERC405("Test Token", "TEST", DECIMALS, FROZEN_TIME);
        
        // 给测试账户一些 ETH
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
    }

    function testInitialSetup() public view {
        assertEq(token.name(), "Test Token");
        assertEq(token.symbol(), "TEST");
        assertEq(token.decimals(), DECIMALS);
        assertEq(token.frozenTime(), FROZEN_TIME);
        assertEq(token.minted(), 0);
    }

    function testMinting() public {
        // 铸造 1 个完整单位的代币
        token.mint(alice, 2*UNIT);
        
        // 检查 ERC20 余额
        assertEq(token.erc20BalanceOf(alice), 2*UNIT);
        assertEq(token.erc721BalanceOf(alice), 1);

        token.mint(alice, 1*UNIT);
        assertEq(token.erc20BalanceOf(alice), 3*UNIT);
        assertEq(token.erc721BalanceOf(alice), 2);
        
    }

    function testErc20TransferFrom() public {
        // 先铸造一些代币给 Alice
        token.mint(alice, 20*UNIT);

        // 切换到 Alice 的视角
        vm.startPrank(alice);

        //这里用try catch测试一下approve
        try token.approve(bob, 2*UNIT) {
            emit ApprovalSuccess("approve success");
        } catch (bytes memory) {
            emit ApprovalFailed("approve failed");
        }


        vm.stopPrank();

        vm.startPrank(bob);
        
        token.transferFrom(alice, bob, UNIT);
        token.transferFrom(alice, bob, UNIT);
        //查看一下_storedERC721Ids 具体内容
        uint256[] memory aliceNFTs = token.owned(alice);
        console.log("Alice's NFT IDs:");
        for(uint256 i = 0; i < aliceNFTs.length; i++) {
            console.log("NFT #", i, ":", aliceNFTs[i]);
        }

        uint256[] memory bobNFTs = token.owned(bob);
        console.log("Bob's NFT IDs:");
        for(uint256 i = 0; i < bobNFTs.length; i++) {
            console.log("NFT #", i, ":", bobNFTs[i]);
        }

        for(uint256 i = 0; i < aliceNFTs.length; i++) {
            console.log("Alice's NFT value#", i, ":", token.tokenIdToTokenCount(aliceNFTs[i]));
        }

        for(uint256 i = 0; i < bobNFTs.length; i++) {
            console.log("Bob's NFT value#", i, ":", token.tokenIdToTokenCount(bobNFTs[i]));
        }

        vm.stopPrank();
    }


    function testErc721TransferFrom() public {
        // 先铸造一些代币给 Alice
        token.mint(alice, 20*UNIT);
        token.mint(alice, 15*UNIT);

        // 切换到 Alice 的视角
        vm.startPrank(alice);

        //这里用try catch测试一下approve
        uint256[] memory beforealiceNFTs = token.owned(alice);
        uint256 NFT_0 = beforealiceNFTs[0];
        
        for(uint256 i = 0; i < beforealiceNFTs.length; i++) {
            console.log("NFT #", i, ":", beforealiceNFTs[i]);
        }

        for(uint256 i = 0; i < beforealiceNFTs.length; i++) {
            console.log("Alice's NFT value#", i, ":", token.tokenIdToTokenCount(beforealiceNFTs[i]));
        }

        try token.erc721Approve(bob, NFT_0) {
            emit ApprovalSuccess("approve success");
        } catch (bytes memory) {
            emit ApprovalFailed("approve failed");
        }


        vm.stopPrank();

        vm.startPrank(bob);
        
        token.transferFrom(alice, bob, NFT_0);
        uint256[] memory afteraliceNFTs = token.owned(alice);

        console.log("Alice's NFT IDs:");
        for(uint256 i = 0; i < afteraliceNFTs.length; i++) {
            console.log("NFT #", i, ":", afteraliceNFTs[i]);
        }

        uint256[] memory bobNFTs = token.owned(bob);
        console.log("Bob's NFT IDs:");
        for(uint256 i = 0; i < bobNFTs.length; i++) {
            console.log("NFT #", i, ":", bobNFTs[i]);
        }

        for(uint256 i = 0; i < afteraliceNFTs.length; i++) {
            console.log("Alice's NFT value#", i, ":", token.tokenIdToTokenCount(afteraliceNFTs[i]));
        }

        for(uint256 i = 0; i < bobNFTs.length; i++) {
            console.log("Bob's NFT value#", i, ":", token.tokenIdToTokenCount(bobNFTs[i]));
        }

        vm.stopPrank();
    }

    function testsetSelfERC721TransferExempt() public {
        token.mint(alice, 20*UNIT);
        vm.startPrank(alice);
        
        try token.setSelfERC721TransferExempt(true) {
            emit SetExemptSuccess("First set will be success");
        } catch (bytes memory) {
            emit ApprovalFailed("set failed, should not appear");
        }

        try token.setSelfERC721TransferExempt(true) {
            emit SetExemptSuccess("set success, should not appear");
        } catch (bytes memory) {
            emit ApprovalFailed("Second set will be failed");
        }
    
        vm.stopPrank();
    }

    function testdepositTokens() public {
        token.mint(alice, 20*UNIT);
        token.mint(alice, 15*UNIT);
        token.mint(bob, 30*UNIT);
        token.mint(bob, 45*UNIT);

        vm.startPrank(alice);

        uint256[] memory beforealiceNFTs = token.owned(alice);
        uint256[] memory beforebobNFTs = token.owned(bob);
        
        token.depositTokens(beforealiceNFTs[0], beforebobNFTs[0], 20*UNIT);
        uint256[] memory afteraliceNFTs = token.owned(alice);
        uint256[] memory afterbobNFTs = token.owned(bob);
        
        console.log("Alice's NFT IDs:");
        for(uint256 i = 0; i < afteraliceNFTs.length; i++) {
            console.log("NFT #", i, ":", afteraliceNFTs[i]);
        }
        
        console.log("Bob's NFT IDs:");
        for(uint256 i = 0; i < afterbobNFTs.length; i++) {
            console.log("NFT #", i, ":", afterbobNFTs[i]);
        }

        for(uint256 i = 0; i < afteraliceNFTs.length; i++) {
            console.log("Alice's NFT value#", i, ":", token.tokenIdToTokenCount(afteraliceNFTs[i]));
        }

        for(uint256 i = 0; i < afterbobNFTs.length; i++) {
            console.log("Bob's NFT value#", i, ":", token.tokenIdToTokenCount(afterbobNFTs[i]));
        }

        uint256[] memory bankNFTs = token.getERC721TokensInQueue(0, token.getERC721QueueLength());
        
        console.log("bank's NFT IDs:");
        for(uint256 i = 0; i < bankNFTs.length; i++) {
            console.log("NFT #", i, ":", bankNFTs[i]);
        }
        
        for(uint256 i = 0; i < bankNFTs.length; i++) {
            console.log("bank's NFT value#", i, ":", token.tokenIdToTokenCount(bankNFTs[i]));
        }


    
        vm.stopPrank();
    }


    function testwithdrawTokens() public {
        token.mint(alice, 20*UNIT);
        token.mint(alice, 15*UNIT);

        vm.startPrank(alice);
        uint256[] memory beforealiceNFTs = token.owned(alice);
        for(uint256 i = 0; i < beforealiceNFTs.length; i++) {
            console.log("NFT #", i, ":", beforealiceNFTs[i]);
        }

        for(uint256 i = 0; i < beforealiceNFTs.length; i++) {
            console.log("Alice's NFT value#", i, ":", token.tokenIdToTokenCount(beforealiceNFTs[i]));
        }

        token.withdrawTokens(beforealiceNFTs[0], 13*UNIT);      
        uint256[] memory afteraliceNFTs = token.owned(alice);
        for(uint256 i = 0; i < afteraliceNFTs.length; i++) {
            console.log("NFT #", i, ":", afteraliceNFTs[i]);
        }

        for(uint256 i = 0; i < afteraliceNFTs.length; i++) {
            console.log("Alice's NFT value#", i, ":", token.tokenIdToTokenCount(afteraliceNFTs[i]));
        }
        vm.stopPrank();

    }


    function testRestoreNFT() public {
        token.mint(alice, 20*UNIT);
        token.mint(alice, 15*UNIT);
        token.mint(bob, 30*UNIT);
        token.mint(bob, 45*UNIT);

        vm.startPrank(alice);

        uint256[] memory beforealiceNFTs = token.owned(alice);
        uint256[] memory beforebobNFTs = token.owned(bob);
        
        token.depositTokens(beforealiceNFTs[1], beforebobNFTs[0], 15*UNIT);
        
        uint256[] memory afteraliceNFTs = token.owned(alice);
        
        console.log("Alice's NFT IDs:");
        for(uint256 i = 0; i < afteraliceNFTs.length; i++) {
            console.log("NFT #", i, ":", afteraliceNFTs[i]);
        }

        for(uint256 i = 0; i < afteraliceNFTs.length; i++) {
            console.log("Alice's NFT value#", i, ":", token.tokenIdToTokenCount(afteraliceNFTs[i]));
        }

        uint256[] memory bankNFTs = token.getERC721TokensInQueue(0, token.getERC721QueueLength());
        
        console.log("bank's NFT IDs:");
        for(uint256 i = 0; i < bankNFTs.length; i++) {
            console.log("NFT #", i, ":", bankNFTs[i]);
        }
        
        for(uint256 i = 0; i < bankNFTs.length; i++) {
            console.log("bank's NFT value#", i, ":", token.tokenIdToTokenCount(bankNFTs[i]));
        }
        
        

        token.RestoreNFT(bankNFTs[0], token.tokenIdToTokenCount(bankNFTs[0]));
        console.log("token.getERC721QueueLength():", token.getERC721QueueLength());

        uint256[] memory nowbankNFTs = token.getERC721TokensInQueue(0, token.getERC721QueueLength());
        

        console.log("nowbank's NFT IDs:");
        for(uint256 i = 0; i < nowbankNFTs.length; i++) {
            console.log("NFT #", i, ":", nowbankNFTs[i]);
        }
        
        for(uint256 i = 0; i < nowbankNFTs.length; i++) {
            console.log("bank's NFT value#", i, ":", token.tokenIdToTokenCount(nowbankNFTs[i]));
        }        
        

        uint256[] memory nowaliceNFTs = token.owned(alice);


    
        
        console.log("Alice's NFT IDs:");
        for(uint256 i = 0; i < nowaliceNFTs.length; i++) {
            console.log("NFT #", i, ":", nowaliceNFTs[i]);
        }
        for(uint256 i = 0; i < nowaliceNFTs.length; i++) {
            console.log("Alice's NFT value#", i, ":", token.tokenIdToTokenCount(nowaliceNFTs[i]));
        }


        vm.stopPrank();

    
    }



}
