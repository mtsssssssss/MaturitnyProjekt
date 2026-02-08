"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AttemptQuestion } from "../../types/test";
import type { QuestionAnswer } from "../../types/test";

type QuestionNavigatorProps = {
  questions: AttemptQuestion[];
  answers: Record<string, QuestionAnswer>;
  currentIndex: number;
  onSelect: (index: number) => void;
};

export function QuestionNavigator({
  questions,
  answers,
  currentIndex,
  onSelect,
}: QuestionNavigatorProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">Otázky</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-1.5 sm:gap-2">
          {questions.map((q, index) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = index === currentIndex;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelect(index)}
                className={cn(
                  "aspect-square rounded-lg border-2 transition-all font-bold text-xs sm:text-sm cursor-pointer min-w-0",
                  isCurrent && "ring-2 ring-primary border-primary",
                  isAnswered
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-muted/50 border-border hover:border-primary/60"
                )}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
