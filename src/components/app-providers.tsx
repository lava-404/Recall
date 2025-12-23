'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { SolanaProvider } from '@/components/solana/solana-provider'
import React from 'react'

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    
      <SolanaProvider>{children}</SolanaProvider>
   
  )
}
