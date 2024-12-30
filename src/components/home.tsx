import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import UserSection from "./sidebar/UserSection";
import TaskSearch from "./sidebar/TaskSearch";
import TaskFilters from "./sidebar/TaskFilters";
import ThemeToggle from "./sidebar/ThemeToggle";
import TaskList from "./TaskList";

const Home = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div
        className={`relative h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-[280px]"
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-6 z-50 h-6 w-6 rounded-full border bg-background"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        <div className="h-full flex flex-col">
          {!isCollapsed && (
            <>
              <UserSection />
              <div className="px-4 py-2">
                <TaskSearch />
              </div>
              <div className="flex-1 overflow-hidden">
                <TaskFilters />
              </div>
              <ThemeToggle
                isDark={isDark}
                onToggle={() => setIsDark(!isDark)}
              />
            </>
          )}

          {isCollapsed && (
            <div className="flex flex-col items-center pt-16 space-y-4">
              <UserSection
                userName=""
                avatarUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <TaskList />
      </div>
    </div>
  );
};

export default Home;
