"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyAttempts } from "@/api/tests";
import { AttemptResultListItem } from "@/types/api/tests";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AttemptsChart } from "@/components/stats/AttemptsChart";
import { AttemptsTable } from "@/components/stats/AttemptsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsPage() {
  const { data, isLoading } = useQuery<AttemptResultListItem[]>({
    queryKey: ["my-attempts"],
    queryFn: getMyAttempts,
  });

  if (isLoading) return <LoadingSpinner />;

  const chartData = (data ?? []).slice(0, 10).map((a) => ({
    name: a.testName.length > 18 ? a.testName.slice(0, 18) + "…" : a.testName,
    uspesnost: Number(a.totalScorePercentage.toFixed(1)),
    spravne: a.correctAnswers,
    celkom: a.totalQuestions,
  }));

  return (
    <div className="py-6 md:py-10 space-y-6 w-[98%] md:w-[95%] max-w-6xl mx-auto px-2 sm:px-4">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        Moje štatistiky testov
      </h1>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Úspešnosť podľa testov</CardTitle>
          </CardHeader>
          <CardContent>
            <AttemptsChart data={chartData} />
          </CardContent>
        </Card>
      )}

      <Card>
        <AttemptsTable data={data ?? []} />
      </Card>
    </div>
  );
}
