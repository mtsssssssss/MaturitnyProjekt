"use client";

import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type AttemptHeaderProps = {
  testName: string;
  testDescription: string;
  timeLeft: number;
  answeredCount: number;
  totalQuestions: number;
};

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function AttemptHeader({
  testName,
  testDescription,
  timeLeft,
  answeredCount,
  totalQuestions,
}: AttemptHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 sm:pb-6 px-2">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight truncate">
          {testName}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">{testDescription}</p>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <div
          className={cn(
            "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border",
            timeLeft < 300 ? "bg-destructive/10 border-destructive/30 text-destructive" : "bg-muted/50"
          )}
        >
          <Clock className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
          <span className="font-bold text-base sm:text-lg tabular-nums">
            {formatTime(timeLeft)}
          </span>
        </div>
        <Badge variant="outline" className="px-3 sm:px-4 py-2 text-sm">
          {answeredCount} / {totalQuestions} odpovedaných
        </Badge>
      </div>
    </div>
  );
}
