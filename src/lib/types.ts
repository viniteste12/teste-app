export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  important: boolean;
  backgroundImage?: string;
  dueDate?: Date;
  type: "daily" | "weekly" | "none";
}

export type TaskFilter =
  | "all"
  | "today"
  | "week"
  | "completed"
  | "uncompleted"
  | "important";
