import { create } from "zustand";
import { Task, TaskFilter } from "./types";

interface TaskState {
  tasks: Task[];
  filter: TaskFilter;
  searchQuery: string;
  addTask: (task: Partial<Task>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  toggleImportant: (id: string) => void;
  setFilter: (filter: TaskFilter) => void;
  setSearchQuery: (query: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [
    {
      id: "1",
      title: "Complete project proposal",
      description: "Write and review the project proposal document",
      completed: false,
      createdAt: new Date(),
      important: true,
      type: "daily",
      backgroundImage:
        "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop",
    },
    {
      id: "2",
      title: "Review code changes",
      description: "Review pull requests and provide feedback",
      completed: true,
      createdAt: new Date(),
      important: false,
      type: "weekly",
      backgroundImage:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    },
  ],
  filter: "all",
  searchQuery: "",

  addTask: (taskData) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: Math.random().toString(36).substring(7),
          title: taskData.title || "",
          description: taskData.description,
          completed: false,
          createdAt: new Date(),
          important: false,
          type: taskData.type || "none",
          backgroundImage: taskData.backgroundImage,
          dueDate: taskData.dueDate,
          ...taskData,
        },
      ],
    })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task,
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    })),

  toggleImportant: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, important: !task.important } : task,
      ),
    })),

  setFilter: (filter) => set({ filter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
