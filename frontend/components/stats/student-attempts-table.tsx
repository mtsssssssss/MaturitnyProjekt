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
import type { StudentAttemptResultListItem } from "@/types/api/tests";

type StudentAttemptsTableProps = { data: StudentAttemptResultListItem[] };

function formatDate(s: string | null | undefined) {
  return s ? new Date(s).toLocaleString("sk-SK") : "-";
}

export function StudentAttemptsTable({ data }: StudentAttemptsTableProps) {
  if (!data?.length) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Zatiaľ nemáte žiadne výsledky žiakov.
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Žiak</TableHead>
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
                <TableCell className="whitespace-nowrap">
                  {a.firstName} {a.lastName} ({a.username})
                </TableCell>
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
              <p className="font-semibold">
                {a.firstName} {a.lastName}
              </p>
              <span className="text-primary font-bold shrink-0">{a.totalScorePercentage.toFixed(1)}%</span>
            </div>
            <p className="text-sm text-muted-foreground">{a.username}</p>
            <p className="font-medium mt-2 truncate" title={a.testName}>{a.testName}</p>
            <p className="text-sm text-muted-foreground">{a.subjectName}</p>
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
