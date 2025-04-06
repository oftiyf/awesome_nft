"use client";

import { getDefaultConfig, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { mainnet, sepolia } from 'wagmi/chains';

// 导入 RainbowKit 样式
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
  appName: "NFT Protocol",
  projectId: "ERC404", // 注意：在生产环境中，这应该是一个有效的 WalletConnect projectId
  chains: [mainnet, sepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}