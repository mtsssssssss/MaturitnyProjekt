"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { submitAnswer, finishTest } from "@/api/tests";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AttemptResults } from "@/components/test-attempt/AttemptResults";
import { AttemptHeader } from "@/components/test-attempt/AttemptHeader";
import { QuestionNavigator } from "@/components/test-attempt/QuestionNavigator";
import { QuestionCard } from "@/components/test-attempt/QuestionCard";
import type { QuestionAnswer } from "@/components/test-attempt/types";
import type { StartTestResponse, FinishTestResponse } from "@/types/api/tests";

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
  const hasTriggeredFinish = useRef(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem(`test_${testAttemptId}`);
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setTestData(parsed.testData);
      setAnswers(parsed.answers || {});
      setTimeLeft(parsed.timeLeft ?? parsed.testData?.timeLimitMinutes * 60 ?? 0);
      setCurrentQuestionIndex(parsed.currentQuestionIndex ?? 0);
    } else {
      router.push(`/tests/${params.id}`);
    }
  }, [testAttemptId, params.id, router]);

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

  const handleFinishTest = useCallback(() => {
    if (confirm("Naozaj chcete ukončiť test? Nebudete môcť pokračovať.")) {
      finishTestMutation.mutate();
    }
  }, [finishTestMutation]);

  useEffect(() => {
    if (!testData || isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!hasTriggeredFinish.current) {
            hasTriggeredFinish.current = true;
            handleFinishTest();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [testData, isFinished, handleFinishTest]);

  useEffect(() => {
    if (!testData || timeLeft <= 0) return;
    const dataToStore = {
      testData,
      answers,
      timeLeft,
      currentQuestionIndex,
    };
    sessionStorage.setItem(`test_${testAttemptId}`, JSON.stringify(dataToStore));
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

  const handleAnswerChange = useCallback(
    (questionId: string, value: string | undefined, type: "abcd" | "writing") => {
      const newAnswer: QuestionAnswer = {
        questionId,
        ...(type === "abcd" ? { selectedAbcdAnswerId: value } : { writtenAnswer: value }),
      };
      setAnswers((prev) => ({ ...prev, [questionId]: newAnswer }));
      if (testAttemptId) submitAnswerMutation.mutate(newAnswer);
    },
    [testAttemptId, submitAnswerMutation]
  );

  if (!testData) {
    return <LoadingSpinner />;
  }

  if (isFinished && results) {
    return <AttemptResults testName={testData.testName} results={results} />;
  }

  const currentQuestion = testData.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = testData.questions.length;

  return (
    <div className="py-4 sm:py-6 md:py-10 space-y-4 sm:space-y-6 w-[95%] max-w-6xl mx-auto px-1">
      <AttemptHeader
        testName={testData.testName}
        testDescription={testData.testDescription}
        timeLeft={timeLeft}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="lg:col-span-1">
          <QuestionNavigator
            questions={testData.questions}
            answers={answers}
            currentIndex={currentQuestionIndex}
            onSelect={setCurrentQuestionIndex}
          />
        </div>
        <div className="lg:col-span-3">
          <QuestionCard
            question={currentQuestion}
            currentAnswer={currentAnswer}
            currentIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            onAnswerChange={handleAnswerChange}
            onPrev={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
            onNext={() =>
              setCurrentQuestionIndex((i) => Math.min(totalQuestions - 1, i + 1))
            }
            onFinish={handleFinishTest}
            isFinishPending={finishTestMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
