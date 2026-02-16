"use client";

import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { cn } from "@/lib/utils";

interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  assignee?: {
    name: string;
    avatar?: string;
  };
  tags?: string[];
  dueDate?: string;
}

interface KanbanCardProps {
  task: KanbanTask;
  className?: string;
  onEdit?: (task: KanbanTask) => void;
  onDelete?: (id: string) => void;
}

export function KanbanCard({ task, className, onEdit, onDelete }: KanbanCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const priorityStyles = {
    low: "bg-green-500/20 text-green-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    high: "bg-red-500/20 text-red-400",
  };

  return (
    <motion.div
      className={cn(
        "rounded-xl bg-zinc-900/50 border border-white/10 p-4 cursor-grab active:cursor-grabbing",
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -2, scale: 1.02 }}
      layout
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-white flex-1">{task.title}</h4>
        {isHovered && (
          <motion.div
            className="flex gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {onEdit && (
              <button
                onClick={() => onEdit(task)}
                className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 rounded text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </motion.div>
        )}
      </div>
      {task.description && (
        <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{task.description}</p>
      )}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.priority && (
            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", priorityStyles[task.priority])}>
              {task.priority}
            </span>
          )}
          {task.dueDate && (
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {task.dueDate}
            </span>
          )}
        </div>
        {task.assignee && (
          task.assignee.avatar ? (
            <img
              src={task.assignee.avatar}
              alt={task.assignee.name}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
              {task.assignee.name.charAt(0)}
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}

interface KanbanColumnProps {
  title: string;
  count?: number;
  color?: string;
  tasks: KanbanTask[];
  onTasksReorder?: (tasks: KanbanTask[]) => void;
  className?: string;
}

export function KanbanColumn({
  title,
  count,
  color = "#8b5cf6",
  tasks,
  onTasksReorder,
  className,
}: KanbanColumnProps) {
  const [items, setItems] = useState(tasks);

  const handleReorder = (newItems: KanbanTask[]) => {
    setItems(newItems);
    onTasksReorder?.(newItems);
  };

  return (
    <div className={cn("w-80 flex-shrink-0", className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="font-semibold text-white">{title}</h3>
        {count !== undefined && (
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-zinc-400 text-xs">
            {count}
          </span>
        )}
      </div>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={handleReorder}
        className="space-y-3"
      >
        {items.map((task) => (
          <Reorder.Item key={task.id} value={task}>
            <KanbanCard task={task} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <motion.button
        className="w-full mt-3 py-2 rounded-lg border border-dashed border-white/20 text-zinc-500 text-sm hover:border-violet-500/50 hover:text-violet-400 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        + Add Task
      </motion.button>
    </div>
  );
}

interface KanbanBoardProps {
  columns: {
    id: string;
    title: string;
    color?: string;
    tasks: KanbanTask[];
  }[];
  className?: string;
}

export function KanbanBoard({ columns, className }: KanbanBoardProps) {
  return (
    <div className={cn("flex gap-6 overflow-x-auto pb-4", className)}>
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          title={column.title}
          color={column.color}
          tasks={column.tasks}
          count={column.tasks.length}
        />
      ))}
    </div>
  );
}
