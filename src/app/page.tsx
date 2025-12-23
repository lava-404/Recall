'use client'

import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { WalletDisconnect } from '@/components/wallet-disconnect'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'
import { ClusterDropdown } from '@/components/cluster-dropdown'
import NoteModal  from '@/components/NoteModal'
import Notes from '@/components/Notes'
import NotesPage from '@/components/NotesPage'
import WalletAdapterButton from '@/components/WalletAdapterButton'

export default function Home() {
  const { account } = useSolana()
  return (
    <div className="flex flex-col items-center gap-4">
      <NotesPage></NotesPage>
      <div className=" text-2xl ">gm.</div>
      <ClusterDropdown />
      {account ? (
        <>
          <WalletDisconnect />
          <WalletAdapterButton></WalletAdapterButton>
          <AppExplorerLink address={account.address} label={`Connected to ${ellipsify(account.address)}`} />
        </>
      ) : (
        <WalletDropdown />
      )}
      
    </div>
  )
}
