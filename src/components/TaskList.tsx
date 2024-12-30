import React from "react";
import { useTaskStore } from "@/lib/store";
import TaskCard from "./TaskCard";

const TaskList = () => {
  const { tasks, filter, searchQuery } = useTaskStore();

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case "today":
        if (!matchesSearch) return false;

        // For tasks with due date, check if it's today
        if (task.dueDate) {
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === today.getTime();
        }
        // For tasks without due date, check if it's daily type
        return task.type === "daily";

      case "week":
        return matchesSearch && task.type === "weekly";
      case "completed":
        return matchesSearch && task.completed;
      case "uncompleted":
        return matchesSearch && !task.completed;
      case "important":
        return matchesSearch && task.important;
      default:
        return matchesSearch;
    }
  });

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTasks.map((task) => (
        <TaskCard key={task.id} taskId={task.id} />
      ))}
    </div>
  );
};

export default TaskList;
