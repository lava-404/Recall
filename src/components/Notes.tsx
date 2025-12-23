import React, { useState, useEffect } from 'react';
import { Search, Menu, Square, LayoutGrid, List, Archive, PenLine, Plus } from 'lucide-react';

// Types
interface Label {
  id: string;
  name: string;
  color: string;
}

interface Note {
  id: string;
  title: string;
  description?: string;
  labels: string[];
  image?: string;
  items?: ChecklistItem[];
  type: 'text' | 'checklist' | 'image';
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface ApiResponse {
  notes: Note[];
  labels: Label[];
}

// Mock API - replace with your actual API
const mockFetchData = async (): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        labels: [
          { id: '1', name: 'Family', color: 'bg-pink-500' },
          { id: '2', name: 'Tasks', color: 'bg-purple-500' },
          { id: '3', name: 'Personal', color: 'bg-green-500' },
          { id: '4', name: 'Meetings', color: 'bg-cyan-500' },
          { id: '5', name: 'Shopping', color: 'bg-teal-500' },
          { id: '6', name: 'Planning', color: 'bg-orange-500' },
          { id: '7', name: 'Travel', color: 'bg-blue-500' },
        ],
        notes: [
          {
            id: '1',
            title: 'Mountain Sunset Photography',
            description: 'Captured this beautiful sunset during our hiking trip. The colors were absolutely stunning!',
            labels: ['1', '3'],
            image: '/images/extra/image5.jpg',
            type: 'image',
          },
          {
            id: '2',
            title: 'Weekly Grocery List',
            type: 'checklist',
            labels: ['3', '4'],
            items: [
              { id: '1', text: 'Organic vegetables', completed: true },
              { id: '2', text: 'Whole grain bread', completed: true },
              { id: '3', text: 'Greek yogurt', completed: false },
              { id: '4', text: 'Fresh fruits', completed: false },
              { id: '5', text: 'Chicken breast', completed: false },
              { id: '6', text: 'Quinoa', completed: true },
              { id: '7', text: 'Almond milk', completed: false },
            ],
          },
          {
            id: '3',
            title: 'Project Milestones',
            description: 'Q1 Goals:\n- Launch beta version\n- Gather user feedback\n- Implement core features\n- Performance optimization\n- Security audit\n- Documentation update',
            labels: ['2'],
            type: 'text',
          },
          {
            id: '4',
            title: 'Desert Road Trip Ideas',
            description: 'Potential routes for our upcoming desert adventure. Need to plan stops and accommodation.',
            labels: ['3'],
            image: '/images/extra/image3.jpg',
            type: 'image',
          },
          {
            id: '5',
            title: 'Home Renovation Tasks',
            type: 'checklist',
            labels: ['2'],
            items: [
              { id: '1', text: 'Paint living room', completed: false },
              { id: '2', text: 'Replace kitchen faucet', completed: true },
              { id: '3', text: 'Fix bathroom tiles', completed: false },
              { id: '4', text: 'Install new light fixtures', completed: false },
            ],
          },
        ],
      });
    }, 500);
  });
};

// Label Button Component
const LabelButton: React.FC<{ label: Label; active?: boolean; onClick?: () => void }> = ({
  label,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-md text-sm transition-all h-9 px-4 py-2 w-full justify-start font-normal ${
      active ? 'bg-accent' : 'hover:bg-accent'
    }`}
  >
    <span className={`me-1 size-2 rounded-full ${label.color}`}></span>
    {label.name}
  </button>
);

// Badge Component
const Badge: React.FC<{ label: Label }> = ({ label }) => (
  <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-colors overflow-hidden text-foreground hover:bg-accent hover:text-accent-foreground">
    <span className={`me-1 size-2 shrink-0 rounded-full ${label.color}`}></span>
    {label.name}
  </span>
);

// Checkbox Component
const ChecklistItemComponent: React.FC<{
  item: ChecklistItem;
  onToggle: (id: string) => void;
}> = ({ item, onToggle }) => (
  <li className={`flex items-center space-x-2 ${item.completed ? 'text-muted-foreground line-through' : ''}`}>
    <button
      onClick={() => onToggle(item.id)}
      className={`peer size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] ${
        item.completed
          ? 'bg-primary text-primary-foreground border-primary'
          : 'border-input hover:border-primary'
      }`}
    >
      {item.completed && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="size-3.5"
        >
          <path d="M20 6 9 17l-5-5"></path>
        </svg>
      )}
    </button>
    <label className="text-sm leading-none font-medium cursor-pointer">{item.text}</label>
  </li>
);

// Note Card Component
const NoteCard: React.FC<{
  note: Note;
  labels: Label[];
  onChecklistToggle?: (noteId: string, itemId: string) => void;
}> = ({ note, labels, onChecklistToggle }) => {
  const noteLabels = labels.filter((l) => note.labels.includes(l.id));

  return (
    <div className="bg-card text-card-foreground flex-col border py-6 relative mb-4 block break-inside-avoid gap-0 overflow-hidden rounded-md transition-shadow hover:shadow-lg">
      {note.image && (
        <figure className="top-0 h-full shrink-0">
          <img
            alt={note.title}
            loading="lazy"
            width="200"
            height="150"
            src={note.image}
            className="aspect-square h-full w-full object-cover"
          />
        </figure>
      )}
      <div className="px-6 pt-6">
        <div className="space-y-4">
          <h3 className="font-display text-xl lg:text-2xl">{note.title}</h3>
          {note.description && (
            <p className="text-muted-foreground text-sm whitespace-pre-line">{note.description}</p>
          )}
          {note.items && note.items.length > 0 && (
            <ul className="space-y-4">
              {note.items.map((item) => (
                <ChecklistItemComponent
                  key={item.id}
                  item={item}
                  onToggle={(itemId) => onChecklistToggle?.(note.id, itemId)}
                />
              ))}
            </ul>
          )}
          {noteLabels.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {noteLabels.map((label) => (
                <Badge key={label.id} label={label} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'masonry' | 'list'>('masonry');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await mockFetchData();
        // Replace mockFetchData with your actual API call:
        // const response = await fetch('YOUR_API_ENDPOINT');
        // const data = await response.json();
        setNotes(data.notes);
        setLabels(data.labels);
        setError(null);
      } catch (err) {
        setError('Failed to load notes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLabel = !selectedLabel || note.labels.includes(selectedLabel);
    return matchesSearch && matchesLabel;
  });

  // Handle checklist toggle
  const handleChecklistToggle = (noteId: string, itemId: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId && note.items
          ? {
              ...note,
              items: note.items.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            }
          : note
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 flex flex-1 flex-col min-h-screen">

        {/* Main Content */}
        <div className="flex-1 w-full">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="relative flex max-w-md flex-1 space-x-3 xl:space-x-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="items-center justify-center rounded-md text-sm font-medium border bg-background hover:bg-accent h-9 flex shrink-0 xl:hidden"
              >
                <Menu size={20} />
              </button>
              <div className="relative flex-1">
                <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  className="h-9 min-w-0 rounded-md border bg-transparent px-3 py-1 pl-10 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Search notes"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('masonry')}
                className={`p-2 rounded-md h-9 ${
                  viewMode === 'masonry'
                    ? 'bg-primary text-primary-foreground'
                    : 'border hover:bg-accent'
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md h-9 ${
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'border hover:bg-accent'
                }`}
              >
                <List size={16} />
              </button>
            </div>

            <button className="xl:hidden inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
              <Plus size={16} />
            </button>
          </div>

          {/* Notes Grid/List */}
          {error && (
            <div className="text-center py-8 text-destructive">
              <p>{error}</p>
            </div>
          )}

          {filteredNotes.length === 0 && !error && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No notes found</p>
            </div>
          )}

          <div
            className={
              viewMode === 'masonry'
                ? 'grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3'
                : 'space-y-4'
            }
          >
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                labels={labels}
                onChecklistToggle={handleChecklistToggle}
              />
            ))}
          </div>
        </div>
      </div>
    
  );
}
