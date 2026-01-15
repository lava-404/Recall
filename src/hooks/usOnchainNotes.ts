import { useEffect, useState } from 'react'
import { Connection } from '@solana/web3.js'
import { Program, AnchorProvider } from '@coral-xyz/anchor'
import idl from '@/idl/anchor.json'
import { Note } from '@/types/note'
import { LAZORKIT_CONFIG } from '@/config/lazorkit'

const CACHE_KEY = 'onchain_notes'
const CACHE_TIME_KEY = 'onchain_notes_last_fetch'
const TTL = 60_000 // 60 seconds

export function useOnchainNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  

  useEffect(() => {
    const fetchNotes = async () => {
      const now = Date.now()
      const cached = localStorage.getItem(CACHE_KEY)
      const lastFetch = localStorage.getItem(CACHE_TIME_KEY)

      // ⚡ 1. Serve cache immediately (no early return)
      if (cached) {
        setNotes(JSON.parse(cached))
        setLoading(false)
      }

      // ⏳ Skip RPC only if cache is still fresh
      if (cached && lastFetch && now - Number(lastFetch) < TTL) {
        return
      }

      try {
        const connection = new Connection(LAZORKIT_CONFIG.rpcUrl, 'confirmed')

        const provider = new AnchorProvider(
          connection,
          {} as any, // no wallet needed for reads
          { commitment: 'confirmed' }
        )

        const program = new Program(idl as any, provider)

        const accounts = await (program.account as any).note.all()

        const parsed: Note[] = accounts.map((a: any) => ({
          id: a.publicKey.toBase58(),
          title: a.account.title,
          message: a.account.message,
        }))

        // 🔄 update state + cache
        setNotes(parsed)
        localStorage.setItem(CACHE_KEY, JSON.stringify(parsed))
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString())
      } catch (e) {
        console.error('RPC fetch failed:', e)
        // keep showing cached data if RPC fails
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [])

  return { notes, loading }
}
