"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { submitAnswer, finishTest } from "@/api/tests";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft, ListChecks, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { StartTestResponse, FinishTestResponse } from "@/types/api/tests";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type QuestionAnswer = {
  questionId: string;
  selectedAbcdAnswerId?: string;
  writtenAnswer?: string;
};

export default function TestAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const testAttemptId = searchParams.get("attemptId");
  
  const [testData, setTestData] = useState<StartTestResponse | null>(null);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<FinishTestResponse | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const storedData = sessionStorage.getItem(`test_${testAttemptId}`);
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setTestData(parsed.testData);
      setAnswers(parsed.answers || {});
      setTimeLeft(parsed.timeLeft || parsed.testData.timeLimitMinutes * 60);
      setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
    } else {
      router.push(`/tests/${params.id}`);
    }
  }, [testAttemptId, params.id, router]);

  useEffect(() => {
    if (!testData || isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testData, isFinished]);

  useEffect(() => {
    if (testData && timeLeft > 0) {
      const dataToStore = {
        testData,
        answers,
        timeLeft,
        currentQuestionIndex,
      };
      sessionStorage.setItem(`test_${testAttemptId}`, JSON.stringify(dataToStore));
    }
  }, [testData, answers, timeLeft, currentQuestionIndex, testAttemptId]);

  const submitAnswerMutation = useMutation({
    mutationFn: async (answer: QuestionAnswer) => {
      if (!testAttemptId) throw new Error("Test attempt ID missing");
      return submitAnswer({
        testAttemptId,
        questionId: answer.questionId,
        selectedAbcdAnswerId: answer.selectedAbcdAnswerId,
        writtenAnswer: answer.writtenAnswer,
      });
    },
  });

  const finishTestMutation = useMutation({
    mutationFn: async () => {
      if (!testAttemptId) throw new Error("Test attempt ID missing");
      return finishTest({ testAttemptId });
    },
    onSuccess: (data) => {
      setResults(data);
      setIsFinished(true);
      sessionStorage.removeItem(`test_${testAttemptId}`);
    },
  });

  const handleAnswerChange = (questionId: string, value: string | undefined, type: "abcd" | "writing") => {
    const newAnswer: QuestionAnswer = {
      questionId,
      ...(type === "abcd" ? { selectedAbcdAnswerId: value } : { writtenAnswer: value }),
    };
    
    setAnswers((prev) => ({
      ...prev,
      [questionId]: newAnswer,
    }));

    if (testAttemptId) {
      submitAnswerMutation.mutate(newAnswer, {
        onError: (error) => {
          console.error("Chyba pri odosielaní odpovede:", error);
        },
      });
    }
  };

  const handleFinishTest = () => {
    if (confirm("Naozaj chcete ukončiť test? Nebudete môcť pokračovať.")) {
      finishTestMutation.mutate();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!testData) {
    return <LoadingSpinner />;
  }

  if (isFinished && results) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6 md:p-10">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Výsledky testu</CardTitle>
            <CardDescription>{testData.testName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-slate-50">
                <div className="text-sm text-muted-foreground">Celkový počet otázok</div>
                <div className="text-2xl font-bold">{results.totalQuestions}</div>
              </div>
              <div className="p-4 border rounded-lg bg-green-50">
                <div className="text-sm text-muted-foreground">Správne odpovede</div>
                <div className="text-2xl font-bold text-green-700">{results.correctAnswers}</div>
              </div>
              <div className="p-4 border rounded-lg bg-blue-50">
                <div className="text-sm text-muted-foreground">Úspešnosť</div>
                <div className="text-2xl font-bold text-blue-700">
                  {results.totalScorePercentage.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => router.push("/tests/test-yourself")} variant="outline" className="cursor-pointer">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Späť na testy
              </Button>
              <Button onClick={() => router.push("/dashboard")} className="cursor-pointer">
                Prejsť na dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = testData.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = testData.questions.length;

  return (
    <div className="py-6 md:py-10 space-y-6 w-[95%] mx-auto max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 px-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {testData.testName}
          </h1>
          <p className="text-muted-foreground mt-1">{testData.testDescription}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg border",
            timeLeft < 300 ? "bg-red-50 border-red-200 text-red-700" : "bg-slate-50"
          )}>
            <Clock className="h-5 w-5" />
            <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>
          <Badge variant="outline" className="px-4 py-2">
            {answeredCount} / {totalQuestions} odpovedaných
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Otázky</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {testData.questions.map((q, index) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = index === currentQuestionIndex;
                  
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={cn(
                        "aspect-square rounded-lg border-2 transition-all font-bold text-sm cursor-pointer",
                        isCurrent && "ring-2 ring-primary border-primary",
                        isAnswered ? "bg-green-100 border-green-300" : "bg-slate-50 border-slate-200 hover:border-primary"
                      )}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    Otázka {currentQuestionIndex + 1} z {totalQuestions}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {currentQuestion.answers && currentQuestion.answers.length > 0 ? (
                      <Badge variant="default" className="gap-1">
                        <ListChecks className="h-3 w-3" />
                        ABCD Otázka
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Type className="h-3 w-3" />
                        Písomná otázka
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-lg border">
                <p className="text-lg font-medium">{currentQuestion.questionText}</p>
              </div>

              {currentQuestion.answers && currentQuestion.answers.length > 0 ? (
                <div className="space-y-3">
                  {currentQuestion.answers.map((answer) => (
                    <label
                      key={answer.id}
                      className={cn(
                        "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all",
                        currentAnswer?.selectedAbcdAnswerId === answer.id
                          ? "bg-primary/10 border-primary ring-2 ring-primary/20"
                          : "bg-white hover:bg-slate-50"
                      )}
                    >
                      <Checkbox
                        checked={currentAnswer?.selectedAbcdAnswerId === answer.id}
                        onCheckedChange={(checked) => {
                          handleAnswerChange(
                            currentQuestion.id,
                            checked ? answer.id : undefined,
                            "abcd"
                          );
                        }}
                      />
                      <span className="flex-1 font-medium">{answer.answer}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Zadajte svoju odpoveď..."
                    value={currentAnswer?.writtenAnswer || ""}
                    onChange={(e) =>
                      handleAnswerChange(currentQuestion.id, e.target.value, "writing")
                    }
                    className="min-h-32"
                  />
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Predchádzajúca
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleFinishTest}
                  disabled={finishTestMutation.isPending}
                  className="cursor-pointer"
                >
                  {finishTestMutation.isPending ? "Ukončujem..." : "Ukončiť test"}
                </Button>
                <Button
                  onClick={() =>
                    setCurrentQuestionIndex(
                      Math.min(totalQuestions - 1, currentQuestionIndex + 1)
                    )
                  }
                  disabled={currentQuestionIndex === totalQuestions - 1}
                  className="cursor-pointer"
                >
                  Ďalšia
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
