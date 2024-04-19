import { Laptop, Moon, Sun } from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";

import { useTheme } from "./ThemeProvider";

const ThemeDropdown = () => {
  const { theme, setTheme } = useTheme();
  if (theme == "dark") {
    return (
      <Button variant="ghost" size="icon" onClick={() => setTheme("light")}>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }
  if (theme == "light") {
    return (
      <Button variant="ghost" size="icon" onClick={() => setTheme("dark")}>
        <Moon className="h-4 w-4" />
      </Button>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeDropdown;
