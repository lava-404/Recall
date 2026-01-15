import { useState, useEffect } from 'react';

import Navbar from '@/components/Navbar'

import NotePreview from './NotePreview';
import { useOnchainNotes } from '@/hooks/usOnchainNotes'

// Mock API - replace with your actual API
// User Dropdown Component


// Main App with Navbar
export default function RecallApp() {
  const [isDark, setIsDark] = useState(false);

  const { notes, loading } = useOnchainNotes()
  // Fetch labels on mount


  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-slate-950 max-w-[100vw]">
        {/* Sticky Navbar */}
        <Navbar />

        {/* Main Content Wrapper */}
        <div className="flex">

          {/* Content Area */}
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          {loading ? (
            <div className="text-center py-20 text-slate-500">
                Loading notes from Solana…
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="text-4xl font-bold">Welcome to Recall</h2>
                <p>Click “Add Note” to create your first note</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notes.map(n => (
                  <NotePreview
                    key={n.id}
                    title={n.title}
                    message={n.message}
                  />
                ))}

              </div>
            )}


            
          </main>
        </div>
      </div>
    </div>
  );
}