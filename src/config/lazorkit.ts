/**
 * LazorKit + Solana Environment Configuration
 * Single source of truth for network, RPC, tokens, paymaster & explorer
 */

//
// ──────────────────────────────────────────────────────────────
// Networks
// ──────────────────────────────────────────────────────────────
//

export type SolanaNetwork = 'devnet' | 'mainnet'

interface NetworkConfig {
  label: string
  rpc: string
  explorer: string
  paymaster: string
}

const NETWORKS: Record<SolanaNetwork, NetworkConfig> = {
  devnet: {
    label: 'Devnet',
    rpc: 'https://api.devnet.solana.com',
    explorer: 'https://explorer.solana.com/?cluster=devnet',
    paymaster: 'https://kora.devnet.lazorkit.com',
  },
  mainnet: {
    label: 'Mainnet',
    rpc: 'https://api.mainnet-beta.solana.com',
    explorer: 'https://explorer.solana.com',
    paymaster: 'https://kora.mainnet.lazorkit.com',
  },
}

// 👉 Change network here
export const CURRENT_NETWORK = NETWORKS.devnet

//
// ──────────────────────────────────────────────────────────────
// LazorKit Provider Config
// ──────────────────────────────────────────────────────────────
//

export const LAZORKIT_PORTAL = 'https://portal.lazor.sh'

export const LAZORKIT_CONFIG = {
  rpcUrl: CURRENT_NETWORK.rpc,
  portalUrl: LAZORKIT_PORTAL,
  paymasterUrl: CURRENT_NETWORK.paymaster,
}

//
// ──────────────────────────────────────────────────────────────
// Token Registry
// ──────────────────────────────────────────────────────────────
//

export const TOKEN_REGISTRY = {
  devnet: {
    SOL: {
      symbol: 'SOL',
      mint: 'So11111111111111111111111111111111111111112',
      decimals: 9,
    },
    USDC: {
      // Devnet USDC (FAKE, NOT MAINNET)
      symbol: 'USDC',
      mint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
      decimals: 6,
    },
  },

  mainnet: {
    SOL: {
      symbol: 'SOL',
      mint: 'So11111111111111111111111111111111111111112',
      decimals: 9,
    },
    USDC: {
      symbol: 'USDC',
      mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      decimals: 6,
    },
  },
} as const

export function getNetworkTokens() {
  return CURRENT_NETWORK.label === 'Mainnet'
    ? TOKEN_REGISTRY.mainnet
    : TOKEN_REGISTRY.devnet
}

//
// ──────────────────────────────────────────────────────────────
// Explorer Helpers
// ──────────────────────────────────────────────────────────────
//

export function txExplorerUrl(signature: string) {
  return `${CURRENT_NETWORK.explorer}tx/${signature}`
}

export function addressExplorerUrl(address: string) {
  return `${CURRENT_NETWORK.explorer}address/${address}`
}

export function shortenAddress(addr: string, n = 4) {
  return `${addr.slice(0, n)}…${addr.slice(-n)}`
}

//
// ──────────────────────────────────────────────────────────────
// Retry & Timeout Policy
// ──────────────────────────────────────────────────────────────
//

export const TX_RETRY_POLICY = {
  attempts: 3,
  backoffMs: 1_500,
  timeoutMs: 60_000,
} as const
