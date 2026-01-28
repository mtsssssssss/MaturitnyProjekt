"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export function AppNavbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex h-12 sm:h-14 shrink-0 items-center gap-3 border-b bg-background px-3 sm:px-4">
      <SidebarTrigger className="size-8 sm:size-9 shrink-0" />
      <span className="text-sm font-semibold truncate">Maturitné testy</span>
      <div className="flex-1 min-w-0" />
      <Button
        variant="ghost"
        size="icon"
        className="relative size-8 sm:size-9 shrink-0"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={theme === "dark" ? "Svetlý režim" : "Tmavý režim"}
      >
        <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </header>
  );
}

export function AppNavbarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarInset>
      <AppNavbar />
      <div className="flex-1 overflow-auto">{children}</div>
    </SidebarInset>
  );
}
