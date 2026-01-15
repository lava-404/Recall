'use client'

import NotesPage from '@/components/NotesPage';
import { LazorkitProvider } from '@lazorkit/wallet'

export default function Home() {
  const CONFIG = {
    RPC_URL: "https://api.devnet.solana.com",
    PORTAL_URL: "https://portal.lazor.sh",
    PAYMASTER: { 
      paymasterUrl: "https://kora.devnet.lazorkit.com" 
    }
  };

  return (
    <LazorkitProvider
      rpcUrl={CONFIG.RPC_URL}
      portalUrl={CONFIG.PORTAL_URL}
      paymasterConfig={CONFIG.PAYMASTER}
    >
      <NotesPage />
    </LazorkitProvider>
  )
}
