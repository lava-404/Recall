'use client'
import { Search, Bell, Settings, Moon, Sun, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import NoteModal from '@/components/NoteModal';
import { useWallet } from '@lazorkit/wallet'

function ellipsify(addr, chars) {
  if (!addr) return ''
  return `${addr.slice(0, chars)}…${addr.slice(-chars)}`
}

function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { isConnected, wallet, disconnect } = useWallet()

  const smartWallet = wallet?.smartWallet

  if (!isConnected || !smartWallet) return null

  return (
    <div className="relative">
      {/* Avatar trigger (NOT a button inside a button) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 size-9 cursor-pointer transition"
      >
        <span className="text-white font-medium text-sm">
          {smartWallet[0].toUpperCase()}
        </span>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
          
          {/* Wallet info */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500 mb-2">
              SMART WALLET
            </p>
            <div className="font-mono text-sm text-slate-800 dark:text-slate-200 break-all">
              {ellipsify(smartWallet, 6)}
            </div>
          </div>

          {/* Actions */}
          <div className="p-2 space-y-1">
            <div
              onClick={() => navigator.clipboard.writeText(smartWallet)}
              className="px-4 py-2 text-sm cursor-pointer rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Copy address
            </div>

            <div
              onClick={() => {
                disconnect()
                setIsOpen(false)
              }}
              className="px-4 py-2 text-sm cursor-pointer rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Disconnect
            </div>
          </div>

          {/* Close */}
          <div className="p-2 border-t border-slate-200 dark:border-slate-700">
            <div
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm cursor-pointer rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-center"
            >
              Close
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 max-w-[100vw]">
          <div className="w-[100vw] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 gap-4">
              {/* Logo */}
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Recall
                </h1>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3">
                {/* Add Note Button */}
                <NoteModal />

                {/* Notifications */}
                <button className="relative inline-flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 size-9 transition-all">
                  <Bell className="size-5 text-slate-700 dark:text-slate-300" />
                  <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full"></span>
                </button>

                
                

                {/* User Profile */}
                <UserDropdown  />

                {/* Mobile Sidebar Toggle */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden inline-flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 size-9 transition-all"
                >
                  <Menu className="size-5 text-slate-700 dark:text-slate-300" />
                </button>
              </div>
            </div>
          </div>
        </nav>
  )
}


export default Navbar