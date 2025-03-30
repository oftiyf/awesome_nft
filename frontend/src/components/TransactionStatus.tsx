import { useTransactionStatus } from "../hook/useTransactionStatus"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export function TransactionStatus() {
  const { status, transactionHash } = useTransactionStatus()

  if (status === "idle") return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-md">
      <div className="flex items-start gap-3">
        {status === "pending" && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
        {status === "mining" && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
        {status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
        {status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}

        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {status === "pending" && "等待确认"}
            {status === "mining" && "交易处理中"}
            {status === "success" && "交易成功"}
            {status === "error" && "交易失败"}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-300">
            {status === "pending" && "请在钱包中确认交易..."}
            {status === "mining" && "交易已提交到区块链，等待确认..."}
            {status === "success" && "交易已成功确认！"}
            {status === "error" && "交易失败，请重试。"}
          </p>

          {transactionHash && (status === "mining" || status === "success") && (
            <a
              href={`https://etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline mt-1 inline-block"
            >
              查看交易详情
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

