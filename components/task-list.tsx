"use client"

import { ListChecks } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface Task {
  id: string
  text: string
  completed: boolean
}

interface TaskListProps {
  tasks: Task[]
  onToggleTask: (id: string) => void
}

export function TaskList({ tasks, onToggleTask }: TaskListProps) {
  if (tasks.length === 0) return null

  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <Card className="border-border bg-muted/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <ListChecks className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            Extracted Tasks
          </CardTitle>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {completedCount}/{tasks.length} done
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <label
              key={task.id}
              className="group flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => onToggleTask(task.id)}
                className="mt-0.5"
              />
              <span
                className={cn(
                  "text-sm leading-relaxed transition-all",
                  task.completed
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                )}
              >
                {task.text}
              </span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
