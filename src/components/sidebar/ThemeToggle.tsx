import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  isDark?: boolean;
  onToggle?: () => void;
}

const ThemeToggle = ({
  isDark = false,
  onToggle = () => {},
}: ThemeToggleProps) => {
  return (
    <div className="w-full h-12 bg-background flex items-center px-4 border-t">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="w-full flex items-center justify-start gap-3 hover:bg-accent"
      >
        {isDark ? (
          <>
            <Moon className="h-4 w-4" />
            <span className="text-sm font-medium">Dark Mode</span>
          </>
        ) : (
          <>
            <Sun className="h-4 w-4" />
            <span className="text-sm font-medium">Light Mode</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default ThemeToggle;
