import { useState, useRef } from 'react';
import { X, Bold, Italic, Underline, List, MoreVertical, Image, Tag, Archive, Trash2, Square } from 'lucide-react';
import { useSolana } from '@/components/solana/use-solana'
import { PublicKey } from "@solana/web3.js"
import { Connection, Transaction } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";

import idl from "@/idl/anchor.json";
import { Anchor } from "../../anchor/target/types/anchor";
export default function NoteModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [showListMenu, setShowListMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [clickedButton, setClickedButton] = useState(null);
  const editorRef = useRef(null);
  const { account } = useSolana();
  
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  if (!account?.address) {
    return null; // or loading spinner
  }



const anchorWallet = {
  publicKey: new PublicKey(account.address),

  signTransaction: async (tx) => {
    return await window.solana.signTransaction(tx);
  },

  signAllTransactions: async (txs) => {
    return await window.solana.signAllTransactions(txs);
  },
};

  const provider = new AnchorProvider(
    connection,
    anchorWallet, // ✅ REAL wallet from useSolana
    { commitment: "confirmed" }
  );
  
  const program = new Program(idl, provider);

  const applyFormatting = (type) => {
    document.execCommand(type, false, null);
    editorRef.current?.focus();
  };

  
  const handleFormat = (type) => {
    setClickedButton(type);
    applyFormatting(type);
    setTimeout(() => setClickedButton(null), 300);
  };

  const handleAddNote = async () => {
    if (!account) {
      alert("Connect wallet first");
      return;
    }
  
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
  
    const content = editorRef.current?.innerHTML || "";
  
    try {
      const tx = await program.methods
        .createEntry(title, content)
        .rpc({ commitment: "confirmed" });
  
      console.log("Transaction:", tx);
  
      alert(`✓ Note "${title}" saved successfully!`);
  
      setTitle("");
      setMessage("");
      editorRef.current.innerHTML = "";
      setIsOpen(false);
  
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };
  


  const TooltipButton = ({ icon: Icon, label, onClick, id, command }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          type="button"
          onClick={() => {
            setClickedButton(id);
            if (command) {
              document.execCommand(command, false, null);
            } else {
              onClick?.();
            }
            editorRef.current?.focus();
            setTimeout(() => setClickedButton(null), 300);
          }}
          className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-all dark:text-white size-8 ${
            clickedButton === id
              ? 'bg-blue-600 text-white scale-110'
              : 'hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Icon className="size-4" />
        </button>
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none">
            {label}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
          </div>
        )}
      </div>
    );
  };

  const ActionButton = ({ icon: Icon, label, onClick, id }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          type="button"
          onClick={() => {
            setClickedButton(id);
            onClick();
            setTimeout(() => setClickedButton(null), 300);
          }}
          className={`inline-flex items-center justify-center rounded-md transition-all dark:text-white size-9 ${
            clickedButton === id
              ? 'bg-blue-600 text-white scale-110'
              : 'hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Icon className="size-4" />
        </button>
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none">
            {label}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-black-700 h-9 px-4 py-2 transition-all"
      >
        <Square size={16} />
        Add Note
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-950 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-950">
              <h2 className="text-lg font-semibold dark:text-white">Add Note</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 size-8 transition-all"
              >
                <X className="size-5 dark:text-white" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xl bg-transparent border-0 px-0 py-1 placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-white dark:placeholder:text-slate-600"
              />

              <div className="flex flex-col rounded-md border border-slate-200 dark:border-slate-800 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <div className="shrink-0 overflow-x-auto border-b border-slate-200 dark:border-slate-800 p-2 bg-slate-50 dark:bg-slate-900">
                  <div className="flex w-max items-center gap-1">
                    <TooltipButton
                      icon={Bold}
                      label="Bold"
                      id="bold"
                      command="bold"
                    />

                    <TooltipButton
                      icon={Italic}
                      label="Italic"
                      id="italic"
                      command="italic"
                    />

                    <TooltipButton
                      icon={Underline}
                      label="Underline"
                      id="underline"
                      command="underline"
                    />

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-all dark:text-white size-8 ${
                          showMoreMenu
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        title="More options"
                      >
                        <MoreVertical className="size-4" />
                      </button>
                      {showMoreMenu && (
                        <div className="absolute top-full mt-2 left-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20">
                          <button
                            onClick={() => {
                              document.execCommand('createCode', false, null);
                              editorRef.current?.focus();
                              setShowMoreMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-white"
                          >
                            Code
                          </button>
                          <button
                            onClick={() => {
                              document.execCommand('strikethrough', false, null);
                              editorRef.current?.focus();
                              setShowMoreMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-white border-t border-slate-200 dark:border-slate-700"
                          >
                            Strikethrough
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="w-px h-7 bg-slate-300 dark:bg-slate-700 mx-2" />

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowListMenu(!showListMenu)}
                        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-all dark:text-white w-8 h-8 ${
                          showListMenu
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        title="Lists"
                      >
                        <List className="size-4" />
                      </button>
                      {showListMenu && (
                        <div className="absolute top-full mt-2 left-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20">
                          <button
                            onClick={() => {
                              document.execCommand('insertUnorderedList', false, null);
                              editorRef.current?.focus();
                              setShowListMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-white"
                          >
                            • Bullet list
                          </button>
                          <button
                            onClick={() => {
                              document.execCommand('insertOrderedList', false, null);
                              editorRef.current?.focus();
                              setShowListMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-white border-t border-slate-200 dark:border-slate-700"
                          >
                            1. Numbered list
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => setMessage(e.currentTarget.innerHTML)}
                  className="w-full min-h-72 p-5 bg-white dark:bg-slate-950 border-0 resize-none placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-600 text-sm"
                  style={{
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  <br />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <ActionButton
                    icon={Image}
                    label="Add image"
                    onClick={() => console.log('Image clicked')}
                    id="image"
                  />

                  <ActionButton
                    icon={Tag}
                    label="Add label"
                    onClick={() => console.log('Label clicked')}
                    id="tag"
                  />

                  <ActionButton
                    icon={Archive}
                    label="Archive"
                    onClick={() => console.log('Archive clicked')}
                    id="archive"
                  />

                  <ActionButton
                    icon={Trash2}
                    label="Delete"
                    onClick={() => console.log('Delete clicked')}
                    id="delete"
                  />
                </div>
                <button
                  onClick={handleAddNote}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2 transition-all"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}