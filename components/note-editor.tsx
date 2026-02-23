"use client"

import { Sparkles, ListChecks, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NoteEditorProps {
  title: string
  content: string
  onTitleChange: (value: string) => void
  onContentChange: (value: string) => void
  onSummarize: () => void
  onExtractTasks: () => void
  isSummarizing: boolean
  isExtracting: boolean
}

export function NoteEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSummarize,
  onExtractTasks,
  isSummarizing,
  isExtracting,
}: NoteEditorProps) {
  return (
    <div className="flex flex-1 flex-col">
      {/* Title Input */}
      <input
        type="text"
        placeholder="Untitled Note"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full border-none bg-transparent px-0 text-3xl font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0"
      />

      {/* Content Editor */}
      <textarea
        placeholder="Start writing your note..."
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className="mt-4 min-h-[240px] w-full flex-1 resize-none border-none bg-transparent text-base leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-0"
      />

      {/* AI Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          onClick={onSummarize}
          disabled={!content.trim() || isSummarizing}
          className="gap-2"
        >
          {isSummarizing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Summarize with AI
        </Button>
        <Button
          onClick={onExtractTasks}
          disabled={!content.trim() || isExtracting}
          variant="outline"
          className="gap-2"
        >
          {isExtracting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ListChecks className="h-4 w-4" />
          )}
          Extract Tasks
        </Button>
      </div>
    </div>
  )
}
