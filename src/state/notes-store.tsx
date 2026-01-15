'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { Note } from '@/types/note'

interface NotesContextType {
  notes: Note[]
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
}

const NotesContext = createContext<NotesContextType | null>(null)

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])

  return (
    <NotesContext.Provider value={{ notes, setNotes }}>
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes(): NotesContextType {
  const ctx = useContext(NotesContext)
  if (!ctx) throw new Error('useNotes must be used inside NotesProvider')
  return ctx
}
