import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { useTaskStore } from "@/lib/store";

interface UserSectionProps {
  userName?: string;
  avatarUrl?: string;
}

const UserSection = ({
  userName = "John Doe",
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
}: UserSectionProps) => {
  const tasks = useTaskStore((state) => state.tasks);
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl} alt={userName} />
          <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back,
          </p>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {userName}
          </h2>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Task Progress
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {completedTasks}/{totalTasks}
          </span>
        </div>
        <Progress
          value={progress}
          className="h-2 bg-gray-100 dark:bg-gray-700"
        />
      </div>
    </div>
  );
};

export default UserSection;
