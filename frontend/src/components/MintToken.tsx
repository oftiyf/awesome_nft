import { useState } from "react";
import { Button } from "./ui/button";
import { Coins } from "lucide-react";

interface MintTokenProps {
  onMint: (amount: string) => Promise<void>;
}

export function MintToken({ onMint }: MintTokenProps) {
  const [amount, setAmount] = useState('');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex-1">
      <div className="flex items-center gap-3 mb-6">
        <Coins className="w-5 h-5 text-green-500" />
        <h2 className="text-xl font-bold text-black">Mint token</h2>
      </div>

      <p className="text-gray-600 mb-4">Mint token to your account</p>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="input mint amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded-md text-black"
        />
        <Button 
          onClick={() => onMint(amount)}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          Mint
        </Button>
      </div>
    </div>
  );
}