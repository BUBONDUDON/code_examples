import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  tags: string[];
}

export type CreateTaskInput = Omit<Task, "id" | "createdAt"> & { createdAt?: Date };

export type UpdateTaskInput = Partial<Omit<Task, "id" | "createdAt">> & { id: string };

type TasksContextValue = {
  tasks: Task[];
  createTask: (input: CreateTaskInput) => Task;
  updateTask: (input: UpdateTaskInput) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  allTags: string[];
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

const STORAGE_KEY = "tasks_v1";

function reviveTasks(raw: unknown): Task[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((t) => {
      try {
        const createdAt = new Date((t as any).createdAt);
        return {
          id: String((t as any).id ?? crypto.randomUUID?.() ?? Date.now().toString()),
          title: String((t as any).title ?? ""),
          description: (t as any).description ? String((t as any).description) : undefined,
          status: ((t as any).status as Task["status"]) ?? "todo",
          priority: ((t as any).priority as Task["priority"]) ?? "medium",
          createdAt: isNaN(createdAt.getTime()) ? new Date() : createdAt,
          tags: Array.isArray((t as any).tags) ? (t as any).tags.map(String) : [],
        } satisfies Task;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Task[];
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return reviveTasks(JSON.parse(raw));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const serializable = tasks.map((t) => ({ ...t, createdAt: t.createdAt.toISOString() }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch {
    }
  }, [tasks]);

  const createTask = useCallback((input: CreateTaskInput): Task => {
    const newTask: Task = {
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      createdAt: input.createdAt ?? new Date(),
      tags: input.tags ?? [],
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((input: UpdateTaskInput) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === input.id ? { ...t, ...input, id: t.id, createdAt: t.createdAt } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getTaskById = useCallback((id: string) => tasks.find((t) => t.id === id), [tasks]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const t of tasks) {
      for (const tag of t.tags) set.add(tag);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [tasks]);

  const value = useMemo<TasksContextValue>(
    () => ({ tasks, createTask, updateTask, deleteTask, getTaskById, allTags }),
    [tasks, createTask, updateTask, deleteTask, getTaskById, allTags]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
}


