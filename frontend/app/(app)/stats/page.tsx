"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyAttempts } from "@/api/tests";
import { AttemptResultListItem } from "@/types/api/tests";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function StatsPage() {
  const { data, isLoading } = useQuery<AttemptResultListItem[]>({
    queryKey: ["my-attempts"],
    queryFn: getMyAttempts,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="py-6 md:py-10 space-y-6 w-[98%] md:w-[95%] mx-auto">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
        Moje štatistiky testov
      </h1>

      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test</TableHead>
              <TableHead>Začiatok</TableHead>
              <TableHead>Koniec</TableHead>
              <TableHead>Otázky</TableHead>
              <TableHead>Správne</TableHead>
              <TableHead>Úspešnosť</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((a) => (
              <TableRow key={a.testAttemptId}>
                <TableCell>{a.testName}</TableCell>
                <TableCell>
                  {a.testStarted
                    ? new Date(a.testStarted).toLocaleString("sk-SK")
                    : "-"}
                </TableCell>
                <TableCell>
                  {a.testFinished
                    ? new Date(a.testFinished).toLocaleString("sk-SK")
                    : "-"}
                </TableCell>
                <TableCell>{a.totalQuestions}</TableCell>
                <TableCell>{a.correctAnswers}</TableCell>
                <TableCell>{a.totalScorePercentage.toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

