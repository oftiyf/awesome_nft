"use client"

import { createContext, useState, useContext, ReactNode } from 'react';

type TxStatus = 'pending' | 'success' | 'error' | 'rejected';

type ToastContextType = {
  showTxToast: (status: TxStatus, txHash?: string, customMessage?: string) => void;
  hideToast: () => void;
  toastState: {
    isVisible: boolean;
    status: TxStatus | null;
    message: string;
    txHash?: string;
  };
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastState, setToastState] = useState({
    isVisible: false,
    status: null as TxStatus | null,
    message: '',
    txHash: undefined as string | undefined,
  });

  const showTxToast = (status: TxStatus, txHash?: string, customMessage?: string) => {
    const defaultMessages = {
      pending: 'Transaction pending...',
      success: 'Transaction confirmed!',
      error: 'Transaction failed',
      rejected: 'Transaction rejected',
    };

    setToastState({
      isVisible: true,
      status,
      message: customMessage || defaultMessages[status],
      txHash,
    });

    // 成功/失败状态5秒后自动关闭，pending状态不自动关闭
    if (status !== 'pending') {
      setTimeout(hideToast, 5000);
    }
  };

  const hideToast = () => {
    setToastState(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <ToastContext.Provider value={{ showTxToast, hideToast, toastState }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}