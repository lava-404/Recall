'use client'

import { useState } from 'react'
import { X, Square } from 'lucide-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { useWallet } from '@lazorkit/wallet'
import { useNotes } from '@/state/notes-store'
import { ConnectButton } from './ConnectButton'
import { AppExplorerLink } from './app-explorer-link'
import idl from '@/idl/anchor.json'

export default function NoteModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { setNotes } = useNotes()
  const { smartWalletPubkey, signAndSendTransaction } = useWallet()

  /* ---------- Anchor setup (read-only wallet) ---------- */

  const connection = new Connection('https://api.devnet.solana.com', 'confirmed')

  const DUMMY_WALLET = {
    publicKey: new PublicKey('11111111111111111111111111111111'),
    signTransaction: async () => {
      throw new Error('Handled by LazorKit')
    },
    signAllTransactions: async () => {
      throw new Error('Handled by LazorKit')
    },
  }

  const provider = new AnchorProvider(connection, DUMMY_WALLET, {
    commitment: 'confirmed',
  })

  const program = new Program(idl, provider)

  /* ---------- Core logic ---------- */

  const handleAddNote = async () => {
    if (!title.trim()) return alert('Please enter a title')
    if (!smartWalletPubkey) return alert('Connect wallet first')

    try {
      setIsSubmitting(true)

      const ix = await program.methods
        .createEntry(title.trim(), message.trim())
        .instruction()

      const signature = await signAndSendTransaction({
        instructions: [ix],
        transactionOptions: { commitment: 'confirmed' },
      })
      alert(
        `Note added successfully!
      
      Transaction signature:
      ${signature}
      
      View on Solana Explorer:
      https://explorer.solana.com/tx/${signature}?cluster=devnet`
      )
      

      // update UI instantly
      setNotes(prev => [
        { title, message, createdAt: Date.now() },
        ...prev,
      ])

      
      setIsOpen(false)
      setTitle('')
      setMessage('')

      
    } catch (err) {
      console.error(err)
      alert('Transaction failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Open modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
      >
        <Square size={16} />
        Add Note
      </button>


      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-8/10 max-w-lg rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">Add Note</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full border rounded-md px-3 py-2 text-sm"
              />

              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Write your note..."
                rows={5}
                className="w-full border rounded-md px-3 py-2 text-sm resize-none"
              />

              <div className="flex justify-end">
                {smartWalletPubkey ? (
                  <button
                    onClick={handleAddNote}
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      isSubmitting
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isSubmitting ? 'Adding…' : 'Add Note'}
                  </button>
                ) : (
                  <ConnectButton />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
