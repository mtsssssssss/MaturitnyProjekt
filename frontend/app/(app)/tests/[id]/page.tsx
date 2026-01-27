"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { startTest } from "@/api/tests";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StartTestRequest } from "@/types/api/tests";
import { Button } from "@/components/ui/button";
import { Play, HelpCircle } from "lucide-react";

export default function Test() {
  const params = useParams();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: StartTestRequest) => startTest(data),
    onSuccess: (response) => {
      sessionStorage.setItem(`test_${response.testAttemptId}`, JSON.stringify({
        testData: response,
        answers: {},
        timeLeft: response.timeLimitMinutes * 60,
        currentQuestionIndex: 0,
      }));
      router.push(`/tests/${params.id}/attempt?attemptId=${response.testAttemptId}`);
    },
    onError: (error) => {
      console.error("Chyba pri spustení testu:", error);
    }
  });

  const handleStartTest = () => {
    if (!params.id) return;

    const testId = Array.isArray(params.id) ? params.id[0] : params.id;
    mutation.mutate({ testId });
  };

  return (
    <div className="flex h-full w-full items-center justify-center p-6 md:p-10">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Spustiť test</CardTitle>
          <CardDescription>
            Po spustení testu začne bežať časový limit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm">Test ID: {params.id}</span>
          </div>
          
          <Button 
            onClick={handleStartTest} 
            disabled={mutation.isPending}
            size="lg"
            className="w-full cursor-pointer"
          >
            {mutation.isPending ? (
              "Spúšťam test..."
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Spustiť test
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
