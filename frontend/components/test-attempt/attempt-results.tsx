"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { FinishTestResponse } from "./types";

type AttemptResultsProps = {
  testName: string;
  results: FinishTestResponse;
};

export function AttemptResults({ testName, results }: AttemptResultsProps) {
  const router = useRouter();

  return (
    <div className="flex h-full w-full items-center justify-center p-4 sm:p-6 md:p-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl md:text-3xl">Výsledky testu</CardTitle>
          <CardDescription>{testName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground">Celkový počet otázok</div>
              <div className="text-xl sm:text-2xl font-bold">{results.totalQuestions}</div>
            </div>
            <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
              <div className="text-sm text-muted-foreground">Správne odpovede</div>
              <div className="text-xl sm:text-2xl font-bold text-primary">
                {results.correctAnswers}
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
              <div className="text-sm text-muted-foreground">Úspešnosť</div>
              <div className="text-xl sm:text-2xl font-bold text-primary">
                {results.totalScorePercentage.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => router.push("/tests/test-yourself")}
              variant="outline"
              className="cursor-pointer w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2 shrink-0" />
              Späť na testy
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              className="cursor-pointer w-full sm:w-auto"
            >
              Prejsť na dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
