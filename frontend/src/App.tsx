import { useEffect, useState } from "react";
import { TokenInfo } from "./components/TokenInfo";
import { TransactionForm } from "./components/TransactionForm";
import { NFTTransferForm } from "./components/NFTTransferForm";
import { Coins } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useBalance,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { formatUnits, parseUnits } from "ethers";
import { abi } from "./abi";

function App() {
  const { writeContract } = useWriteContract();
  const { address } = useAccount();
  const [balance, setBalance] = useState("0");
  const [erc20Balance, setErc20Balance] = useState("0");
  const [erc721Balance, setErc721Balance] = useState("0");
  const [symbol, setSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("0");

  const { data: balanceData } = useBalance({
    address: address,
  });

  const handleTransfer = async (
    toAddress: string,
    amount: string
  ): Promise<void> => {
    if (!address) return; // 确保发送地址存在
    try {
      const amountInWei = parseUnits(amount, 18); // 转换为正确的精度
      writeContract({
        abi,
        address: "0x285B1F4AEE4695AcE58307f4bdbaD41417661e50",
        functionName: "erc20TransferFrom",
        args: [address, toAddress, amountInWei],
      });

      console.log(`成功转账 ${amount} 个 Token 到地址 ${toAddress}`);
    } catch (error) {
      console.error("转账失败:", error);
    }
  };

  const handleWithdraw = async (amount: string) => {
    const amountInWei = parseUnits(amount, 18);
    writeContract({
      abi,
      address: "0x285B1F4AEE4695AcE58307f4bdbaD41417661e50",
      functionName: "withdrawTokens",
      args: [amountInWei],
    });
  };

  const handleDeposit = async (id: string, amount: string) => {
    const amountInWei = parseUnits(amount, 18);
    const tokenId = BigInt(id); // 确保 ID 是正确的数值类型
    writeContract({
      abi,
      address: "0x285B1F4AEE4695AcE58307f4bdbaD41417661e50",
      functionName: "depositTokens",
      args: [tokenId, amountInWei],
    });
  };

  const onNFTTransfer = async (from: string, to: string, tokenId: string) => {
    if (!from || !to || !tokenId) {
      console.error("Invalid transfer parameters");
      return;
    }
    try {
      writeContract({
        abi,
        address: "0x285B1F4AEE4695AcE58307f4bdbaD41417661e50",
        functionName: "erc721TransferFrom",
        args: [from, to, tokenId], // 参数包括转出地址、接收地址和 Token ID
      });
      console.log("NFT transferred successfully");
    } catch (error) {
      console.error("NFT transfer failed:", error);
    }
  };

  const onGetOwner = async (tokenId: string) => {
    if (!tokenId) {
      console.error("Token ID is required");
      return "";
    }

    try {
      // 调用合约中的 ownerOf 方法获取拥有者地址
      const owner = useReadContract({
        abi,
        address: "0x285B1F4AEE4695AcE58307f4bdbaD41417661e50",
        functionName: "ownerOf",
        args: [tokenId], // 传入 Token ID
      });
      console.log("Current Owner:", owner);
      return owner;
    } catch (error) {
      console.error("Failed to get owner:", error);
      return "";
    }
  };

  console.log("User balance:", balanceData);

  useEffect(() => {
    if (address) {
      console.log("User address:", address);
      console.log("User balance:", balanceData);
    }
  }, [address, balanceData]);

  // 在组件顶层声明这些 hooks
  const erc20BalanceResult = useReadContract({
    abi,
    address: "0x285B1F4AEE4695AcE58307f4bdbaD41417661e50",
    functionName: "erc20BalanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  });

  const erc721BalanceResult = useReadContract({
    abi,
    address: "0x285B1F4AEE4695AcE58307f4bdbaD41417661e50",
    functionName: "erc721BalanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  });

  const supplyResult = useReadContract({
    abi,
    address: "0x285B1F4AEE4695AcE58307f4bdbaD41417661e50",
    functionName: "totalSupply",
  });

  const symbolResult = useReadContract({
    abi,
    address: "0x285B1F4AEE4695AcE58307f4bdbaD41417661e50",
    functionName: "symbol",
  });

  // 使用 useEffect 监听数据变化
  useEffect(() => {
    if (erc20BalanceResult?.data) {
      setErc20Balance(formatUnits(erc20BalanceResult.data as bigint, 18));
    }
    if (erc721BalanceResult?.data) {
      setErc721Balance((erc721BalanceResult.data as bigint).toString()); // ERC-721 是整数，无需缩放
    }
    if (supplyResult.data) {
      setTotalSupply(formatUnits(supplyResult.data as bigint, 18));
    }
    if (symbolResult.data) {
      setSymbol(symbolResult.data as string);
    }
  }, [
    erc20BalanceResult?.data,
    erc721BalanceResult?.data,
    supplyResult.data,
    symbolResult.data,
  ]);
  console.log("balance", balance);
  console.log("supply", totalSupply);
  console.log("erc721BalanceResult", erc721Balance);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Coins className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Token Dashboard</h1>
          </div>
          <ConnectButton />
        </div>

        <TokenInfo
          balance={balance}
          totalSupply={totalSupply}
          symbol={symbol}
        />

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 mb-8"
          onClick={() => {
            if (!address) return;
            writeContract({
              abi,
              address: "0x285B1F4AEE4695AcE58307f4bdbaD41417661e50",
              functionName: "mint",
              args: [address, BigInt(10 * 10 ** 18)],
            });
          }}
        >
          mint Supply Token
        </button>

        <TransactionForm
          onTransfer={handleTransfer}
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
        />

        <NFTTransferForm onTransfer={onNFTTransfer} />
      </div>
    </div>
  );
}

export default App;
