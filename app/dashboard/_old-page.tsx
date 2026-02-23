"use client";

import { useState, useCallback } from "react";
import { NotesSidebar, type Note } from "@/components/notes-sidebar";
import { NoteEditor } from "@/components/note-editor";
import { SummaryCard } from "@/components/summary-card";
import { TaskList, type Task } from "@/components/task-list";
import { EmptyState } from "@/components/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const INITIAL_NOTES: Note[] = [
  {
    id: "1",
    title: "Project Kickoff Meeting",
    content:
      "Discussed the new product roadmap for Q2. The team agreed to focus on three key areas: improving onboarding UX, building an API integration layer, and launching a self-serve analytics dashboard. Design will deliver wireframes by Friday. Engineering estimates 6 weeks for the MVP. Need to align with marketing on launch messaging. Follow up with Sarah about the budget approval for the new hires.",
    updatedAt: new Date(2026, 1, 12),
  },
  {
    id: "2",
    title: "Research: AI in Note-Taking",
    content:
      "Explored how AI can enhance note-taking workflows. Key findings: 1) Automatic summarization reduces review time by 40%. 2) Task extraction from meeting notes saves an average of 15 minutes per meeting. 3) Smart tagging and categorization help with long-term organization. 4) Semantic search outperforms keyword search for knowledge retrieval. Competitors like Notion, Mem, and Reflect are already integrating these features.",
    updatedAt: new Date(2026, 1, 11),
  },
  {
    id: "3",
    title: "Weekly Standup Notes",
    content:
      "Frontend: Completed the new sidebar navigation and note list UI. Backend: API endpoints for CRUD operations are ready. Design: Finalizing the AI summary card component. Blockers: Need design tokens from the brand team. Next sprint: Focus on real-time collaboration features and offline support.",
    updatedAt: new Date(2026, 1, 10),
  },
  {
    id: "4",
    title: "Reading List",
    content:
      "Books to read this quarter: 'Designing Data-Intensive Applications' by Martin Kleppmann, 'The Pragmatic Programmer' by Hunt & Thomas, 'Thinking in Systems' by Donella Meadows. Articles: React Server Components deep dive, Vercel Edge Functions best practices, Building AI-first applications.",
    updatedAt: new Date(2026, 1, 9),
  },
];

function simulateSummary(content: string): string {
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length <= 2) return content.trim();
  const key = sentences
    .slice(0, 3)
    .map((s) => s.trim())
    .join(". ");
  return key + ".";
}

function simulateTasks(content: string): string[] {
  const patterns = [
    /(?:need to|must|should|will|have to|follow up|align with|deliver|complete|focus on|finalize)\s+([^.!?]+)/gi,
  ];
  const tasks: string[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const task = match[1].trim();
      if (task.length > 10 && task.length < 120) {
        tasks.push(task.charAt(0).toUpperCase() + task.slice(1));
      }
    }
  }
  if (tasks.length === 0) {
    const sentences = content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 15);
    return sentences.slice(0, 3).map((s) => s.trim());
  }
  return [...new Set(tasks)].slice(0, 6);
}

export default function DashboardPage1() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [activeNoteId, setActiveNoteId] = useState<string | null>("1");
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  const handleNewNote = useCallback(() => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "",
      content: "",
      updatedAt: new Date(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    setMobileOpen(false);
  }, []);

  const handleSelectNote = useCallback((id: string) => {
    setActiveNoteId(id);
    setMobileOpen(false);
  }, []);

  const handleDeleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => {
        const updated = prev.filter((n) => n.id !== id);
        if (activeNoteId === id) {
          setActiveNoteId(updated.length > 0 ? updated[0].id : null);
        }
        return updated;
      });
      setSummaries((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setTasks((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    },
    [activeNoteId],
  );

  const handleTitleChange = useCallback(
    (value: string) => {
      if (!activeNoteId) return;
      setNotes((prev) =>
        prev.map((n) =>
          n.id === activeNoteId
            ? { ...n, title: value, updatedAt: new Date() }
            : n,
        ),
      );
    },
    [activeNoteId],
  );

  const handleContentChange = useCallback(
    (value: string) => {
      if (!activeNoteId) return;
      setNotes((prev) =>
        prev.map((n) =>
          n.id === activeNoteId
            ? { ...n, content: value, updatedAt: new Date() }
            : n,
        ),
      );
    },
    [activeNoteId],
  );

  const handleSummarize = useCallback(async () => {
    if (!activeNote) return;
    setIsSummarizing(true);
    await new Promise((r) => setTimeout(r, 1200));
    const summary = simulateSummary(activeNote.content);
    setSummaries((prev) => ({ ...prev, [activeNote.id]: summary }));
    setIsSummarizing(false);
  }, [activeNote]);

  const handleExtractTasks = useCallback(async () => {
    if (!activeNote) return;
    setIsExtracting(true);
    await new Promise((r) => setTimeout(r, 1000));
    const extracted = simulateTasks(activeNote.content);
    const newTasks: Task[] = extracted.map((text, i) => ({
      id: `${activeNote.id}-task-${i}`,
      text,
      completed: false,
    }));
    setTasks((prev) => ({ ...prev, [activeNote.id]: newTasks }));
    setIsExtracting(false);
  }, [activeNote]);

  const handleToggleTask = useCallback(
    (taskId: string) => {
      if (!activeNoteId) return;
      setTasks((prev) => ({
        ...prev,
        [activeNoteId]: (prev[activeNoteId] || []).map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t,
        ),
      }));
    },
    [activeNoteId],
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Content with Sidebar below Navbar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-16 left-0 z-50 w-72 transform transition-transform duration-200 ease-in-out md:relative md:inset-y-0 md:translate-x-0 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <NotesSidebar
            notes={notes}
            activeNoteId={activeNoteId}
            onSelectNote={handleSelectNote}
            onNewNote={handleNewNote}
            onDeleteNote={handleDeleteNote}
          />
        </div>

        {/* Main Content */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile Header */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle sidebar"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <span className="text-sm font-medium text-foreground">
              {activeNote?.title || "AI Smart Notes"}
            </span>
          </div>

          {activeNote ? (
            <ScrollArea className="flex-1">
              <div className="mx-auto w-full max-w-3xl px-6 py-8 md:px-10 md:py-10">
                <NoteEditor
                  title={activeNote.title}
                  content={activeNote.content}
                  onTitleChange={handleTitleChange}
                  onContentChange={handleContentChange}
                  onSummarize={handleSummarize}
                  onExtractTasks={handleExtractTasks}
                  isSummarizing={isSummarizing}
                  isExtracting={isExtracting}
                />

                {/* AI Results */}
                <div className="mt-8 flex flex-col gap-5">
                  {summaries[activeNote.id] && (
                    <SummaryCard summary={summaries[activeNote.id]} />
                  )}
                  {tasks[activeNote.id] && tasks[activeNote.id].length > 0 && (
                    <TaskList
                      tasks={tasks[activeNote.id]}
                      onToggleTask={handleToggleTask}
                    />
                  )}
                </div>
              </div>
            </ScrollArea>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
    </div>
  );
}
