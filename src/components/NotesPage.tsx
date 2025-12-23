import { useState, useEffect } from 'react';
import { Search, Bell, Settings, Moon, Sun, Menu } from 'lucide-react';
import NoteModal from '@/components/NoteModal';
import { Sidebar } from '@/components/Sidebar';
import { Label } from '@/components/types';
import Notes from './Notes';
import WalletAdapterButton from './WalletAdapterButton';
import { WalletDisconnect } from './wallet-disconnect';
import { useSolana } from './solana/use-solana';
import { WalletDropdown } from './wallet-dropdown';

// Mock API - replace with your actual API
const mockFetchLabels = async (): Promise<Label[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', name: 'Family', color: 'bg-pink-500' },
        { id: '2', name: 'Tasks', color: 'bg-purple-500' },
        { id: '3', name: 'Personal', color: 'bg-green-500' },
        { id: '4', name: 'Meetings', color: 'bg-cyan-500' },
        { id: '5', name: 'Shopping', color: 'bg-teal-500' },
        { id: '6', name: 'Planning', color: 'bg-orange-500' },
        { id: '7', name: 'Travel', color: 'bg-blue-500' },
      ]);
    }, 300);
  });
};
// User Dropdown Component
function UserDropdown({ isDark }: { isDark: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cluster, setCluster] = useState('devnet');
  const {account} = useSolana();
  // Mock wallet data - replace with your actual wallet
  const walletPubkey = '4zMMUHtyT68FM4x8V2bq5aB2XcWLCgDayGx5api9GYYE';

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 size-9 transition-all"
      >
        <span className="text-white font-medium text-sm">R</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
          {/* Wallet Info */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              WALLET
            </p>
            <WalletAdapterButton />
          </div>

          {/* Cluster Selection */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3">
              NETWORK
            </p>
            <div className="space-y-2">
              {['devnet', 'testnet'].map((net) => (
                <label key={net} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="cluster"
                    value={net}
                    checked={cluster === net}
                    onChange={(e) => setCluster(e.target.value)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                    {net}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Close Button */}
          <button
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-all"
            >
            {account ? (
              <>
                <WalletDisconnect />
                
              </>
             ) : (
              <WalletDropdown />
            )}
            </button>


          
          <div className="p-3">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-all"
            >
              Close
            </button>
            
          </div>
        </div>
      )}
    </div>
  );
}


// Main App with Navbar
export default function RecallApp() {
  const [isDark, setIsDark] = useState(false);
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Fetch labels on mount
  useEffect(() => {
    const fetchLabels = async () => {
      const data = await mockFetchLabels();
      setLabels(data);
    };
    fetchLabels();
  }, []);

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-slate-950 max-w-[100vw]">
        {/* Sticky Navbar */}
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

                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="inline-flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 size-9 transition-all"
                >
                  {isDark ? (
                    <Sun className="size-5 text-slate-300" />
                  ) : (
                    <Moon className="size-5 text-slate-700" />
                  )}
                </button>

                {/* User Profile */}
                <UserDropdown isDark={isDark} />

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

        {/* Main Content Wrapper */}
        <div className="flex">
          {/* Sidebar */}
          <Sidebar
            labels={labels}
            selectedLabel={selectedLabel}
            onSelectLabel={setSelectedLabel}
            sidebarOpen={sidebarOpen}
            onCloseSidebar={() => setSidebarOpen(false)}
          />

          {/* Content Area */}
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            <div className="text-center py-20">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Welcome to Recall
              </h2>

              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Click the "Add Note" button to create your first note
              </p>
            </div>
            <Notes></Notes>
          </main>
        </div>
      </div>
    </div>
  );
}