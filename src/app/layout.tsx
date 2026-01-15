import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from '@/components/app-providers'
import React from 'react'
import ClientPolyfills from '@/components/ClientPolyfills'
import { NotesProvider } from '@/state/notes-store'
export const metadata: Metadata = {
  title: 'Recall',
  description: 'An example dApp built using Lazorkit SDK',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
      <ClientPolyfills />
        <AppProviders><NotesProvider>{children}</NotesProvider></AppProviders>
      </body>
    </html>
  )
}
// Patch BigInt so we can log it using JSON.stringify without any errors
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
