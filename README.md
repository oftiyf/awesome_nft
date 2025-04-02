# NFT Protocol

## 项目简介

NFT Protocol 是一个创新性的协议，通过将 NFT 与同质化代币(FT)进行价值绑定，在保持 NFT 奢侈品属性的同时增强其流动性，为数字资产创造更多可能性。

### 核心价值
- **价值绑定**：将 NFT 与 FT 进行智能绑定，实现价值互通
- **流动性增强**：在保持 NFT 独特性的同时获得类似 FT 的流动性
- **应用扩展**：支持多种资产形态，包括 LP 头寸、奢侈品 RWA 和游戏资产

## 应用场景

### 1. LP 头寸期权化
将 LP 头寸包装成 NFT，通过价值绑定机制实现类似期权的功能，为流动性提供者创造更多收益机会。

### 2. 奢侈品 RWA
将现实世界中的奢侈品资产通过 NFT 进行代币化，并通过价值绑定机制确保其真实价值，实现奢侈品资产的链上流通。

### 3. GameFi 资产
游戏中的稀有道具和资产可以通过 NFT 形式存在，并通过价值绑定机制实现跨游戏的价值互通和流动性。

## 技术特点

### 1. 智能绑定机制
- 支持 NFT 与 FT 的双向价值绑定
- 保持 NFT 的独特性和奢侈品属性
- 实现价值的灵活转移和流通

### 2. 价值保护
- 通过智能合约确保绑定价值的真实性
- 防止价值稀释和操纵
- 支持价值的可追溯和验证

## 开发环境
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
git clone https://github.com/xxx/nft-protocol.git
cd nft-protocol
forge install
forge test
```

## Known Issues

1. Test Failures
- 5 tests failing with InvalidAmount() error:
  - testApproveAndTransferFrom()
  - testERC721TransferExempt()
  - testMinting()
  - testPartialTransfer()
  - testTransfer()
- Issues likely related to incorrect amount validation logic or calculation methods

2. Random Number Generation
- Lack of secure random number generation mechanism
- Current implementation needs improvement for better randomness

3. Gas Optimization
- High gas consumption in search operations
- Need to optimize lookup methods to reduce gas costs

4. Token Amount Handling
- Invalid amount errors occurring during token operations
- Amount validation and calculation logic needs review
