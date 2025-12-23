import React from 'react';
import { Square, Archive, PenLine } from 'lucide-react';
import { Label } from './types';

interface SidebarProps {
  labels: Label[];
  selectedLabel: string | null;
  onSelectLabel: (labelId: string | null) => void;
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
}

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

export const Sidebar: React.FC<SidebarProps> = ({
  labels,
  selectedLabel,
  onSelectLabel,
  sidebarOpen,
  onCloseSidebar,
}) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } fixed inset-0 z-40 bg-black/50 xl:hidden`}
        onClick={onCloseSidebar}
      ></div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed left-0 top-0 z-30 h-full w-64 bg-background transition-transform xl:sticky xl:translate-x-0 xl:top-18 xl:block xl:space-y-4`}
      >
        <div className="p-4 space-y-4">

          <div className="flex flex-col rounded-md p-2 border">
            <div className="space-y-1">
              <button className="inline-flex items-center gap-2 rounded-md text-sm font-medium hover:bg-accent h-9 px-4 py-2 w-full justify-start">
                <Square size={16} />
                Notes
              </button>
              <button className="inline-flex items-center gap-2 rounded-md text-sm font-medium hover:bg-accent h-9 px-4 py-2 w-full justify-start">
                <Archive size={16} />
                Archive
              </button>
              <button className="inline-flex items-center gap-2 rounded-md text-sm font-medium hover:bg-accent h-9 px-4 py-2 w-full justify-start">
                <PenLine size={16} />
                Edit Labels
              </button>
            </div>

            <div className="bg-border shrink-0 h-px w-full my-4"></div>

            <div className="flex-1">
              <div className="text-muted-foreground mb-3 px-2 text-sm font-medium">Labels</div>
              <nav className="space-y-1">
                {labels.map((label) => (
                  <LabelButton
                    key={label.id}
                    label={label}
                    active={selectedLabel === label.id}
                    onClick={() =>
                      onSelectLabel(selectedLabel === label.id ? null : label.id)
                    }
                  />
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};