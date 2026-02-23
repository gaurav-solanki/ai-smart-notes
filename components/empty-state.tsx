"use client"

import { FileText } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <FileText className="h-7 w-7 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">No note selected</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a note from the sidebar or create a new one to get started.
        </p>
      </div>
    </div>
  )
}
