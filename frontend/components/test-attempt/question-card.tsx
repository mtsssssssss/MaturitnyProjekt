"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ListChecks, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AttemptQuestion, QuestionAnswer } from "./types";

type QuestionCardProps = {
  question: AttemptQuestion;
  currentAnswer: QuestionAnswer | undefined;
  currentIndex: number;
  totalQuestions: number;
  onAnswerChange: (questionId: string, value: string | undefined, type: "abcd" | "writing") => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
  isFinishPending: boolean;
};

export function QuestionCard({
  question,
  currentAnswer,
  currentIndex,
  totalQuestions,
  onAnswerChange,
  onPrev,
  onNext,
  onFinish,
  isFinishPending,
}: QuestionCardProps) {
  const isAbcd = question.answers && question.answers.length > 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-lg sm:text-xl">
            Otázka {currentIndex + 1} z {totalQuestions}
          </CardTitle>
          {isAbcd ? (
            <Badge variant="default" className="gap-1 w-fit">
              <ListChecks className="h-3 w-3 shrink-0" />
              ABCD
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1 w-fit">
              <Type className="h-3 w-3 shrink-0" />
              Písomná
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="p-4 bg-muted/50 rounded-lg border">
          <p className="text-base sm:text-lg font-medium leading-snug">{question.questionText}</p>
        </div>

        {isAbcd ? (
          <div className="space-y-2 sm:space-y-3">
            {question.answers!.map((answer) => (
              <label
                key={answer.id}
                className={cn(
                  "flex items-center gap-3 p-3 sm:p-4 border rounded-lg cursor-pointer transition-all",
                  currentAnswer?.selectedAbcdAnswerId === answer.id
                    ? "bg-primary/10 border-primary ring-2 ring-primary/20"
                    : "bg-card hover:bg-muted/50"
                )}
              >
                <Checkbox
                  checked={currentAnswer?.selectedAbcdAnswerId === answer.id}
                  onCheckedChange={(checked) =>
                    onAnswerChange(question.id, checked ? answer.id : undefined, "abcd")
                  }
                />
                <span className="flex-1 font-medium text-sm sm:text-base">{answer.answer}</span>
              </label>
            ))}
          </div>
        ) : (
          <div>
            <Textarea
              placeholder="Zadajte svoju odpoveď..."
              value={currentAnswer?.writtenAnswer ?? ""}
              onChange={(e) => onAnswerChange(question.id, e.target.value, "writing")}
              className="min-h-28 sm:min-h-32 resize-y"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2 shrink-0" />
            Predchádzajúca
          </Button>
          <Button
            variant="destructive"
            onClick={onFinish}
            disabled={isFinishPending}
            className="cursor-pointer"
          >
            {isFinishPending ? "Ukončujem..." : "Ukončiť test"}
          </Button>
          <Button
            onClick={onNext}
            disabled={currentIndex === totalQuestions - 1}
            className="cursor-pointer"
          >
            Ďalšia
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180 shrink-0" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
