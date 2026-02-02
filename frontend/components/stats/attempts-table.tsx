"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AttemptResultListItem } from "@/types/api/tests";

type AttemptsTableProps = { data: AttemptResultListItem[] };

function formatDate(s: string | null | undefined) {
  return s ? new Date(s).toLocaleString("sk-SK") : "-";
}

export function AttemptsTable({ data }: AttemptsTableProps) {
  if (!data?.length) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Zatiaľ nemáte žiadne dokončené testy.
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test</TableHead>
              <TableHead className="whitespace-nowrap">Predmet</TableHead>
              <TableHead className="whitespace-nowrap">Začiatok</TableHead>
              <TableHead className="whitespace-nowrap">Koniec</TableHead>
              <TableHead>Otázky</TableHead>
              <TableHead>Správne</TableHead>
              <TableHead>Úspešnosť</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((a) => (
              <TableRow key={a.testAttemptId}>
                <TableCell className="font-medium max-w-[180px] truncate" title={a.testName}>
                  {a.testName}
                </TableCell>
                <TableCell className="whitespace-nowrap">{a.subjectName}</TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(a.testStarted)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(a.testFinished)}
                </TableCell>
                <TableCell>{a.totalQuestions}</TableCell>
                <TableCell>{a.correctAnswers}</TableCell>
                <TableCell>{a.totalScorePercentage.toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="md:hidden space-y-3 p-4">
        {data.map((a) => (
          <Card key={a.testAttemptId} className="p-4">
            <div className="flex justify-between items-start gap-2">
              <p className="font-semibold truncate flex-1" title={a.testName}>{a.testName}</p>
              <span className="text-primary font-bold shrink-0">{a.totalScorePercentage.toFixed(1)}%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{a.subjectName}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
              <span>Začiatok: {formatDate(a.testStarted)}</span>
              <span>Koniec: {formatDate(a.testFinished)}</span>
              <span>Otázky: {a.totalQuestions}</span>
              <span>Správne: {a.correctAnswers}</span>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
