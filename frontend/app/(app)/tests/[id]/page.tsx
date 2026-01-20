"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { startTest } from "@/api/tests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StartTestRequest } from "@/types/api/tests";
import { Button } from "@/components/ui/button";

export default function Test() {
  const params = useParams();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: StartTestRequest) => startTest(data),
    onSuccess: (response) => {
      console.log("Test spustený:", response);
      router.push(`/tests/${params.id}/do`);
    },
    onError: () => {
      console.log("Error pri test-start")
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
          <CardTitle>Spusti test</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Toto je test s id: {params.id}</p>
          <Button onClick={handleStartTest} disabled={mutation.isPending}>
            Spusti test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
