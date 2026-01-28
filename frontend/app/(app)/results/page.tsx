"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStudentAttempts } from "@/api/tests";
import { StudentAttemptResultListItem } from "@/types/api/tests";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AttemptsChart } from "@/components/stats/AttemptsChart";
import { StudentAttemptsTable } from "@/components/stats/StudentAttemptsTable";
import { Card } from "@/components/ui/card";

export default function ResultsPage() {
  const { data, isLoading } = useQuery<StudentAttemptResultListItem[]>({
    queryKey: ["student-attempts"],
    queryFn: getStudentAttempts,
  });

  const chartData = useMemo(() => {
    if (!data?.length) return [];
    const byTest = new Map<string, { sum: number; count: number }>();
    for (const a of data) {
      const key = a.testName;
      const prev = byTest.get(key) ?? { sum: 0, count: 0 };
      byTest.set(key, {
        sum: prev.sum + Number(a.totalScorePercentage.toFixed(1)),
        count: prev.count + 1,
      });
    }
    return Array.from(byTest.entries())
      .slice(0, 10)
      .map(([name, v]) => ({
        name: name.length > 18 ? name.slice(0, 18) + "…" : name,
        uspesnost: Math.round((v.sum / v.count) * 10) / 10,
        spravne: 0,
        celkom: 0,
      }));
  }, [data]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="py-6 md:py-10 space-y-6 w-[98%] md:w-[95%] max-w-6xl mx-auto px-2 sm:px-4">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        Výsledky žiakov
      </h1>

      {chartData.length > 0 && (
        <Card>
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Priemerná úspešnosť podľa testu</h2>
            <AttemptsChart data={chartData} />
          </div>
        </Card>
      )}

      <Card>
        <StudentAttemptsTable data={data ?? []} />
      </Card>
    </div>
  );
}
