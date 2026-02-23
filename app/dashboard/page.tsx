"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Note, NotesSidebar } from "@/components/notes-sidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { NoteEditor } from "@/components/note-editor";
import { SummaryCard } from "@/components/summary-card";
import { Task, TaskList } from "@/components/task-list";
import { EmptyState } from "@/components/empty-state";

export default function DashboardPage1() {
  const { user } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  // 🔹 Fetch notes from Supabase including saved AI results
  useEffect(() => {
    if (!user) return;

    const fetchNotes = async () => {
      try {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching notes:", error);
          return;
        }

        if (data) {
          const formatted = data.map((n) => ({
            id: n.id,
            title: n.title ?? "",
            content: n.content ?? "",
            updatedAt: new Date(n.created_at),
            summary: n.summary ?? "",
            tasks: n.extracted_tasks ?? [],
          }));

          setNotes(formatted);
          if (formatted.length > 0) setActiveNoteId(formatted[0].id);

          // Hydrate summaries & tasks
          const summariesMap: Record<string, string> = {};
          const tasksMap: Record<string, Task[]> = {};

          formatted.forEach((note) => {
            if (note.summary) summariesMap[note.id] = note.summary;
            if (note.tasks && note.tasks.length > 0)
              tasksMap[note.id] = note.tasks;
          });

          setSummaries(summariesMap);
          setTasks(tasksMap);
        }
      } catch (err) {
        console.error("Unexpected fetch error:", err);
      }
    };

    fetchNotes();
  }, [user]);

  // 🔹 New Note
  const handleNewNote = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            title: "New Note",
            content: "",
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating note:", error);
        return;
      }

      if (data) {
        const newNote: Note = {
          id: data.id,
          title: data.title ?? "",
          content: data.content ?? "",
          updatedAt: new Date(data.created_at),
        };
        setNotes((prev) => [newNote, ...prev]);
        setActiveNoteId(newNote.id);
        setMobileOpen(false);
      }
    } catch (err) {
      console.error("Unexpected error creating note:", err);
    }
  }, [user]);

  // 🔹 Select Note
  const handleSelectNote = useCallback((id: string) => {
    setActiveNoteId(id);
    setMobileOpen(false);
  }, []);

  // 🔹 Delete Note
  const handleDeleteNote = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) console.error("Delete error:", error.message);

      setNotes((prev) => {
        const updated = prev.filter((n) => n.id !== id);
        if (activeNoteId === id)
          setActiveNoteId(updated.length > 0 ? updated[0].id : null);
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

  // 🔹 Update Title
  const handleTitleChange = useCallback(
    async (value: string) => {
      if (!activeNoteId) return;

      setNotes((prev) =>
        prev.map((n) =>
          n.id === activeNoteId
            ? { ...n, title: value, updatedAt: new Date() }
            : n,
        ),
      );

      const { error } = await supabase
        .from("notes")
        .update({ title: value ?? "", updated_at: new Date().toISOString() })
        .eq("id", activeNoteId);

      if (error) console.error("Update title error:", error.message);
    },
    [activeNoteId],
  );

  // 🔹 Update Content + invalidate AI results
  const handleContentChange = useCallback(
    async (value: string) => {
      if (!activeNoteId) return;

      setNotes((prev) =>
        prev.map((n) =>
          n.id === activeNoteId
            ? { ...n, content: value, updatedAt: new Date() }
            : n,
        ),
      );

      // Clear previous AI results
      setSummaries((prev) => {
        const copy = { ...prev };
        delete copy[activeNoteId];
        return copy;
      });
      setTasks((prev) => {
        const copy = { ...prev };
        delete copy[activeNoteId];
        return copy;
      });

      const { error } = await supabase
        .from("notes")
        .update({
          content: value ?? "",
          summary: null,
          extracted_tasks: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", activeNoteId);

      if (error) console.error("Update content error:", error.message);
    },
    [activeNoteId],
  );

  // 🔹 Summarize with AI (only if not already present)
  const handleSummarize = useCallback(async () => {
    if (!activeNote) return;
    if (summaries[activeNote.id]) return;

    setIsSummarizing(true);
    try {
      const response = await fetch("/api/openai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Summarize this note clearly and concisely:\n\n${activeNote.content}`,
        }),
      });

      const data = await response.json();
      const summaryText = data.result;

      // Save to Supabase
      await supabase
        .from("notes")
        .update({ summary: summaryText })
        .eq("id", activeNote.id);

      setSummaries((prev) => ({ ...prev, [activeNote.id]: summaryText }));
    } catch (err) {
      console.error("Summarize error:", err);
    } finally {
      setIsSummarizing(false);
    }
  }, [activeNote, summaries]);

  // 🔹 Extract tasks with AI (only if not already present)
  const handleExtractTasks = useCallback(async () => {
    if (!activeNote) return;
    if (tasks[activeNote.id]?.length > 0) return;

    setIsExtracting(true);
    try {
      const response = await fetch("/api/openai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Extract up to 5 actionable tasks from the following note:\n\n${activeNote.content}`,
        }),
      });

      const data = await response.json();

      const newTasks: Task[] = data.result
        .split("\n")
        .filter((line: string) => line.trim())
        .map((line: string, i: number) => ({
          id: `${activeNote.id}-task-${i}`,
          text: line.replace(/^[-•\d.\s]+/, "").trim(),
          completed: false,
        }));

      // Save to Supabase
      await supabase
        .from("notes")
        .update({ extracted_tasks: newTasks })
        .eq("id", activeNote.id);

      setTasks((prev) => ({ ...prev, [activeNote.id]: newTasks }));
    } catch (err) {
      console.error("Task extraction error:", err);
    } finally {
      setIsExtracting(false);
    }
  }, [activeNote, tasks]);

  // 🔹 Toggle Task Completion
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
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-1 overflow-hidden">
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

        <main className="flex flex-1 flex-col overflow-hidden">
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
