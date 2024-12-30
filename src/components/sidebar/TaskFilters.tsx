import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CalendarDays,
  InboxIcon,
  Star,
  CheckCircle,
  XCircle,
  Plus,
  Calendar,
} from "lucide-react";
import { useTaskStore } from "@/lib/store";
import { TaskFilter } from "@/lib/types";
import CreateTaskDialog from "../CreateTaskDialog";

const TaskFilters = () => {
  const { tasks, filter, setFilter } = useTaskStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getWeekTasks = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return tasks.filter((task) => {
      const taskDate = new Date(task.createdAt);
      return taskDate >= weekStart && taskDate <= weekEnd;
    });
  };

  const filters = [
    {
      id: "all" as TaskFilter,
      label: "All Tasks",
      icon: <InboxIcon className="w-4 h-4" />,
      count: tasks.length,
    },
    {
      id: "today" as TaskFilter,
      label: "Today's Tasks",
      icon: <CalendarDays className="w-4 h-4" />,
      count: tasks.filter(
        (task) => task.createdAt.toDateString() === new Date().toDateString(),
      ).length,
    },
    {
      id: "week" as TaskFilter,
      label: "Weekly Tasks",
      icon: <Calendar className="w-4 h-4" />,
      count: getWeekTasks().length,
    },
    {
      id: "completed" as TaskFilter,
      label: "Completed Tasks",
      icon: <CheckCircle className="w-4 h-4" />,
      count: tasks.filter((task) => task.completed).length,
    },
    {
      id: "uncompleted" as TaskFilter,
      label: "Uncompleted Tasks",
      icon: <XCircle className="w-4 h-4" />,
      count: tasks.filter((task) => !task.completed).length,
    },
    {
      id: "important" as TaskFilter,
      label: "Important Tasks",
      icon: <Star className="w-4 h-4" />,
      count: tasks.filter((task) => task.important).length,
    },
  ];

  return (
    <div className="w-full bg-background p-4">
      <Button
        className="w-full mb-4 gap-2"
        onClick={() => setIsCreateDialogOpen(true)}
      >
        <Plus className="w-4 h-4" />
        New Task
      </Button>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {filters.map((filterItem) => (
            <Button
              key={filterItem.id}
              variant={filter === filterItem.id ? "secondary" : "ghost"}
              className={`w-full justify-between ${filter === filterItem.id ? "bg-secondary" : ""}`}
              onClick={() => setFilter(filterItem.id)}
            >
              <div className="flex items-center gap-2">
                {filterItem.icon}
                <span>{filterItem.label}</span>
              </div>
              <span className="bg-muted px-2 py-1 rounded-full text-xs">
                {filterItem.count}
              </span>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default TaskFilters;
