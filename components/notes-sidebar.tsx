"use client";

import { Plus, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

interface NotesSidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  onDeleteNote: (id: string) => void;
}

export function NotesSidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onNewNote,
  onDeleteNote,
}: NotesSidebarProps) {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-border bg-card">
      {/* New Note Button */}
      <div className="px-4 pb-3 mt-6">
        <Button
          onClick={onNewNote}
          className="w-full justify-start gap-2"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* Notes List */}
      <ScrollArea className="flex-1 px-3">
        <div className="flex flex-col gap-1 pb-4 grow-0">
          {notes.map((note) => (
            <div
              key={note.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectNote(note.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectNote(note.id);
                }
              }}
              className={cn(
                "group flex w-full max-w-fit cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                activeNoteId === note.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <FileText className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {note.title || "Untitled Note"}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {note.updatedAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                className="ml-auto shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                aria-label={`Delete ${note.title || "Untitled Note"}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
