import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTaskStore } from "@/lib/store";

const TaskSearch = () => {
  const setSearchQuery = useTaskStore((state) => state.setSearchQuery);

  return (
    <div className="relative w-full bg-white dark:bg-gray-800 p-2 rounded-lg">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input
          type="text"
          placeholder="Search tasks..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 w-full bg-transparent border-gray-200 dark:border-gray-700 focus:ring-purple-500 dark:focus:ring-purple-400 rounded-md"
        />
      </div>
    </div>
  );
};

export default TaskSearch;
