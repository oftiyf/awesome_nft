"use client"

import { useState, useEffect } from "react"
import { useToast } from "../hooks/useToast"
import { useWriteContract } from "wagmi"
import { ExternalLink } from "lucide-react"

// 交易状态类型
export type TransactionStatus = "idle" | "pending" | "mining" | "success" | "error"

export function useTransactionStatus() {
  const { toast } = useToast()
  const [txHash, setTxHash] = useState<string | null>(null)

  // 使用 wagmi 的 useWriteContract 钩子
  const { writeContract, data: transactionHash, isSuccess, error, isPending, reset } = useWriteContract()

  // 当前交易状态
  const [status, setStatus] = useState<TransactionStatus>("idle")

  // 监听交易状态变化
  useEffect(() => {
    if (isPending) {
      setStatus("pending")
      showToast("pending", "交易请求已提交，等待钱包确认...")
    } else if (transactionHash && !isSuccess) {
      setStatus("mining")
      setTxHash(transactionHash)
      showToast("mining", `交易已提交到区块链，等待确认...`, transactionHash)
    } else if (isSuccess && transactionHash) {
      setStatus("success")
      setTxHash(transactionHash)
      showToast("success", "交易已成功确认！", transactionHash)
    } else if (error) {
      setStatus("error")
      showToast("error", `交易失败: ${error.message || "未知错误"}`)
    }
  }, [isPending,  transactionHash, isSuccess, error])

  // 显示对应状态的 Toast
  const showToast = (status: TransactionStatus, message: string, hash?: string) => {
    toast({
      title: getStatusTitle(status),
      description: (
        <div className="flex flex-col gap-2">
          <p>{message}</p>
          {hash && (
            <a
              href={`https://etherscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
            >
              查看交易详情 <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      ),
      duration: status === "success" || status === "error" ? 5000 : Number.POSITIVE_INFINITY,
    })
  }

  // 获取状态标题
  const getStatusTitle = (status: TransactionStatus): string => {
    switch (status) {
      case "pending":
        return "等待确认"
      case "mining":
        return "交易处理中"
      case "success":
        return "交易成功"
      case "error":
        return "交易失败"
      default:
        return ""
    }
  }

  // 执行合约写入操作的包装函数
  const executeTransaction = async (contractConfig: any) => {
    try {
      // 重置之前的状态
      reset()
      setStatus("idle")

      // 执行合约写入
      writeContract(contractConfig)
    } catch (err) {
      console.error("Transaction error:", err)
      setStatus("error")
      showToast("error", `准备交易时出错: ${err instanceof Error ? err.message : "未知错误"}`)
    }
  }

  // 清除当前交易状态
  const clearTransaction = () => {
    reset()
    setStatus("idle")
    setTxHash(null)
  }

  return {
    writeContract: executeTransaction,
    status,
    transactionHash: txHash,
    isSuccess: status === "success",
    error,
    clearTransaction,
  }
}

