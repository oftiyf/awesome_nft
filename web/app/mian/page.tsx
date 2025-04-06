import { useEffect, useState } from "react";
import { parseUnits, formatUnits } from "ethers/lib/utils";
import { TokenInfo } from "../components/Tokeninfo";
import { TransactionForm } from "../components/TransactionForm";
import { NFTTransferForm } from "../components/NFTTransferForm";
import { Coins } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useBalance,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { abi } from "../abi";
import { MintToken } from "../components/MintToken";


export default function Main() {
  const { writeContract } = useWriteContract()
  const { address } = useAccount()
  const [balance, setBalance] = useState("0")
  const [erc20Balance, setErc20Balance] = useState("0")
  const [erc721Balance, setErc721Balance] = useState("0")
  const [symbol, setSymbol] = useState("")
  const [nftList, setNFTList] = useState<string[]>([])
  const [totalSupply, setTotalSupply] = useState("0")

  const { data: balanceData } = useBalance({
    address: address,
  })
  const contrct_add = "0xDf8d73Aa213f07285A40a7631F8369c67FF65ea9"

  const handleTransfer = async (toAddress: string, amount: string) => {
    if (!address) return

    try {
      const amountInWei = parseUnits(amount, 18)
      await writeContract({
        abi,
        address: contrct_add,
        functionName: "transfer",
        args: [toAddress as `0x${string}`, amountInWei.toBigInt()],
      })

      console.log(`成功转账 ${amount} 个 Token 到 ${toAddress}`)
    } catch (error) {
      console.error("转账失败:", error)
    }
  }

  const handleDeposit = async (id: string, amount: string) => {
    const amountInWei = parseUnits(amount, 18)
    const tokenId = BigInt(id) // 确保 ID 是正确的数值类型
    writeContract({
      abi,
      address: contrct_add,
      functionName: "depositTokens",
      args: [tokenId, amountInWei.toBigInt()],
    })
  }

  const handleMint = async (amount: string) => {
    const amountInWei = parseUnits(amount, 18)
    if (!address) return
    writeContract({
      abi,
      address: contrct_add,
      functionName: "mint",
      args: [address, amountInWei.toBigInt()],
    })
    // 手动刷新所有相关数据
    await Promise.all([erc20BalanceResult.refetch(), erc721BalanceResult.refetch(), supplyResult.refetch()])
  }

  const onNFTTransfer = async (from: string, to: string, tokenId: string) => {
    if (!from || !to || !tokenId) {
      console.error("Invalid transfer parameters")
      return
    }
    try {
      writeContract({
        abi,
        address: contrct_add,
        functionName: "erc721TransferFrom",
        args: [from as `0x${string}`, to as `0x${string}`, BigInt(tokenId)], // 参数包括转出地址、接收地址和 Token ID
      })
      console.log("NFT transferred successfully")
    } catch (error) {
      console.error("NFT transfer failed:", error)
    }
  }

  useEffect(() => {
    if (address) {
      console.log("User address:", address)
      console.log("User balance:", balanceData)
    }
  }, [address, balanceData])

  // 在组件顶层声明这些 hooks
  const erc20BalanceResult = useReadContract({
    abi,
    address: contrct_add,
    functionName: "erc20BalanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  })

  const erc721BalanceResult = useReadContract({
    abi,
    address: contrct_add,
    functionName: "erc721BalanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  })

  const supplyResult = useReadContract({
    abi,
    address: contrct_add,
    functionName: "totalSupply",
  })

  const symbolResult = useReadContract({
    abi,
    address: contrct_add,
    functionName: "symbol",
  })

  const nftlist = useReadContract({
    abi,
    address: contrct_add,
    functionName: "owned",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  })

  // 使用 useEffect 监听数据变化
  useEffect(() => {
    if (erc20BalanceResult?.data) {
      setErc20Balance(formatUnits(erc20BalanceResult.data as bigint, 18))
    }
    if (erc721BalanceResult?.data) {
      setErc721Balance((erc721BalanceResult.data as bigint).toString()) // ERC-721 是整数，无需缩放
    }
    if (supplyResult.data) {
      setTotalSupply(formatUnits(supplyResult.data as bigint, 18))
    }
    if (symbolResult.data) {
      setSymbol(symbolResult.data as string)
    }
    if (nftlist.data) {
      setNFTList((nftlist.data as readonly bigint[]).map((id) => id.toString()))
    }
  }, [erc20BalanceResult?.data, erc721BalanceResult?.data, supplyResult.data, symbolResult.data])
  console.log("balance", balance)
  console.log("supply", totalSupply)
  console.log("erc721BalanceResult", erc721Balance)

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-10 text-white">
      <div className="max-w mx-auto">
        <nav className="flex items-center justify-between mb-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <Coins className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Token Dashboard</h1>
          </div>
          <ConnectButton />
        </nav>

        <div className="opacity-95  ">
          <TokenInfo
            erc20Balance={erc20Balance}
            erc721balance={erc721Balance}
            totalSupply={totalSupply}
            symbol={symbol}
            nftIds={nftList}
          />
        </div>

        <div className="flex justify-between gap-2 mt-6">
          <MintToken onMint={handleMint} />
          <TransactionForm onTransfer={handleTransfer} onDeposit={handleDeposit} />
          <NFTTransferForm onTransfer={onNFTTransfer} />
        </div>
      </div>
    </div>
  )
}

