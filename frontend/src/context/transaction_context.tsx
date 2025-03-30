"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/useToast"

// 交易状态类型
export type TransactionStatus = "pending" | "success" | "error" | null

// 交易上下文类型
interface TransactionContextType {
  status: TransactionStatus
  message: string
  showTransactionStatus: (status: TransactionStatus, message: string) => void
  hideTransactionStatus: () => void
}

// 创建上下文
const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

// 交易提供者属性
interface TransactionProviderProps {
  children: ReactNode
}

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [status, setStatus] = useState<TransactionStatus>(null)
  const [message, setMessage] = useState("")
  const { toast } = useToast()

  // 显示交易状态
  const showTransactionStatus = (status: TransactionStatus, message: string) => {
    setStatus(status)
    setMessage(message)

    // 使用toast显示通知
    toast({
      title: getStatusTitle(status),
      description: message,
      variant: status === "error" ? "destructive" : "default",
    })
  }

  // 隐藏交易状态
  const hideTransactionStatus = () => {
    setStatus(null)
    setMessage("")
  }

  // 获取状态标题
  const getStatusTitle = (status: TransactionStatus): string => {
    switch (status) {
      case "pending":
        return "交易处理中"
      case "success":
        return "交易成功"
      case "error":
        return "交易失败"
      default:
        return ""
    }
  }

  return (
    <TransactionContext.Provider
      value={{
        status,
        message,
        showTransactionStatus,
        hideTransactionStatus,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

// 使用交易上下文的钩子
export function useTransaction() {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error("useTransaction must be used within a TransactionProvider")
  }
  return context
}

// 交易状态图标组件
export function TransactionStatusIcon({ status }: { status: TransactionStatus }) {
  switch (status) {
    case "pending":
      return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "error":
      return <AlertCircle className="h-5 w-5 text-red-500" />
    default:
      return null
  }
}

