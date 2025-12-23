import React, { useState } from 'react';
import { useSolana } from './solana/use-solana';
import { ellipsify } from '@wallet-ui/react'

interface WalletAdapterButtonProps {
  icon?: string;
  iconAlt?: string;
  walletName?: string;
  walletAddress?: string;
  onClick?: () => void;
  className?: string;
}

export default function WalletAdapterButton({
  icon = "https://play-lh.googleusercontent.com/obRvW02OTYLzJuvic1ZbVDVXLXzI0Vt_JGOjlxZ92XMdBF_i3kqU92u9SgHvJ5pySdM",
  onClick,
  className = "",
}: WalletAdapterButtonProps) {
  
  const { account } = useSolana();
  const walletAddress = ellipsify(account?.address);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (account?.address) {
      await navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        tabIndex={0}
        onClick={onClick}
        className={`
          wallet-adapter-button wallet-adapter-button-trigger
          inline-flex items-center justify-center gap-2
          bg-blue-600 hover:bg-blue-700
          text-white font-medium text-sm
          hover:border-blue-700
          transition-all duration-200
          focus:outline-none focus:ring-1 focus:ring-violet-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          pointer-events-auto
          ${className}
        `}
        style={{ pointerEvents: 'auto' }}
      >
        <i className="wallet-adapter-button-start-icon flex-shrink-0">
          <img 
            src={icon} 
            className="w-5 h-5 object-contain rounded-sm"
          />
        </i>
        <span 
          className="wallet-address text-sm cursor-pointer hover:underline"
          onClick={handleCopy}
        >
          {walletAddress}
        </span>
      </button>
      
      {copied && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap z-50">
          Copied!
        </div>
      )}
    </div>
  );
}