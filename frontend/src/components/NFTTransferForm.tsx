import React, { useState } from 'react';
import { Image } from 'lucide-react';
import { useReadContract } from 'wagmi'; 
import { abi } from "../abi";



interface NFTTransferFormProps {
  onTransfer: (from: string, to: string, tokenId: string) => Promise<void>;
}

export function NFTTransferForm({onTransfer}:NFTTransferFormProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [currentOwner, setCurrentOwner] = useState('');

  const contrct_add = "0xDf8d73Aa213f07285A40a7631F8369c67FF65ea9";

   // 在组件顶层调用Hook
   const { 
    data: ownerData, 
    isError, 
    isLoading, 
    refetch // 添加refetch用于手动触发
  } = useReadContract({
    abi,
    address: contrct_add,
    functionName: 'ownerOf',
    args: [BigInt(tokenId)],
    enabled: false // 默认不自动执行
  });

  // 处理按钮点击
  const handleCheckOwner = () => {
    console.log('Checking owner for token ID:', tokenId);
    console.log('Contract address:', "0x285B1F4AEE4695AcE58307f4bdbaD41417661e50");
    console.log('Current owner:', currentOwner);
    refetch().then(() => {
      if (ownerData) {
        setCurrentOwner(ownerData);
        setFrom(ownerData);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 你可以在此执行转账操作，假设 onTransfer 是你传入的函数
      await onTransfer(from, to, tokenId);
      // 重置表单
      setTo('');
      setTokenId('');
      setCurrentOwner('');
    } catch (error) {
      console.error('NFT transfer failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 flex-1">
      <div className="flex items-center gap-3 mb-6">
        <Image className="w-5 h-5 text-purple-500" />
        <h2 className="text-xl font-bold text-black">NFT Transfer</h2>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-black">Token ID</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            className="flex-1 p-2 border rounded-md text-black"
            placeholder="Enter NFT Token ID"
            required
          />
          <button
            type="button"
            onClick={handleCheckOwner}
            className="px-4 py-2 bg-yellow-400 text-black text-[16px] font-winky rounded-md hover:bg-yellow-500 transition-colors"
          >
            Check Owner
          </button>
        </div>
      </div>

      {currentOwner && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-black">Current Owner:</p>
          <p className="font-mono text-sm text-black">{currentOwner}</p>
        </div>
      )}

      {isLoading && <p>Loading owner...</p>}
      {isError && <p>Error fetching owner.</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-black">To Address</label>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Recipient Address (0x...)"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors"
      >
        Transfer NFT
      </button>
    </form>
  );
}