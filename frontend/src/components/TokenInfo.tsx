import React from 'react';
import { CircleDollarSign, Coins, Wallet } from 'lucide-react';

interface TokenInfoProps {
  erc20Balance: string;
  erc721balance: string;
  symbol: string;
  totalSupply: string;
}

export function TokenInfo({ erc20Balance, erc721balance, symbol, totalSupply }: TokenInfoProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-8 max-w mx-auto flex-1">
      <div className="bg-white p-6 rounded-lg shadow-md text-black flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Wallet className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-black">Token Balance</h3>
        </div>
        <p className="text-2xl font-bold text-black">{erc20Balance} {symbol}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md text-black flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Wallet className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-black">NFT Balance</h3>
        </div>
        <p className="text-2xl font-bold text-black">{erc721balance} {symbol}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md text-black flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Coins className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-black">Total Supply</h3>
        </div>
        <p className="text-2xl font-bold text-black">{totalSupply} {symbol}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md text-black flex-1">
        <div className="flex items-center gap-3 mb-2">
          <CircleDollarSign className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-black">Token Symbol</h3>
        </div>
        <p className="text-2xl font-bold text-black">{symbol}</p>
      </div>
    </div>
  );
}