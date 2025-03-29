"use client"

import { useEffect } from "react";
import { createPortal } from "react-dom";

import { useToast } from "../../context/ToastContext";
import { ExternalLink } from "lucide-react";

export function TxToast() {
  const { toastState, hideToast } = useToast();

  useEffect(() => {
    if (toastState.isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [toastState.isVisible]);

  if (!toastState.isVisible || !toastState.status) return null;

  const statusColors = {
    pending: "bg-blue-500",
    success: "bg-green-500",
    error: "bg-red-500",
    rejected: "bg-orange-500",
  };

  const buttonTexts = {
    pending: "Waiting...",
    success: "OK",
    error: "Try Again",
    rejected: "Understand",
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={toastState.status !== 'pending' ? hideToast : undefined} 
      />
      <div className={`relative flex flex-col items-center justify-center p-6 rounded-lg max-w-md mx-auto ${statusColors[toastState.status]} text-white`}>
        <h3 className="text-xl font-bold mb-2">
          {toastState.status.toUpperCase()}
        </h3>
        <p className="text-center mb-4">{toastState.message}</p>
        
        {toastState.txHash && (
          <a
            href={`https://etherscan.io/tx/${toastState.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm mb-4 hover:underline"
          >
            View on Etherscan <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        )}

        <button
          onClick={hideToast}
          disabled={toastState.status === 'pending'}
          variant={toastState.status === 'pending' ? 'outline' : 'default'}
          className="mt-2"
        >
          {buttonTexts[toastState.status]}
        </button>
      </div>
    </div>,
    document.body
  );
}