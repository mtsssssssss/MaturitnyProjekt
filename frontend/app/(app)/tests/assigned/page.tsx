"use client";

import { useQuery } from "@tanstack/react-query";
import { getAssignedTests } from "@/api/tests";
import { AssignedTestListItem } from "@/types/api/tests";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PageContent } from "@/lib/page-content";
import { PageHeading } from "@/components/ui/page-heading";
import { Inbox } from "lucide-react";

export default function AssignedTestsPage() {
  const router = useRouter();

  const { data, isLoading } = useQuery<AssignedTestListItem[]>({
    queryKey: ["assigned-tests"],
    queryFn: getAssignedTests,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <PageContent>
      <PageHeading
        icon={Inbox}
        title="Pridelené testy"
        subtitle="Testy, ktoré vám boli pridelené na vypracovanie."
      />

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Názov testu</TableHead>
              <TableHead>Predmet</TableHead>
              <TableHead>Popis</TableHead>
              <TableHead>Čas (min)</TableHead>
              <TableHead>Pridelené</TableHead>
              <TableHead className="text-right">Akcie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((t) => (
              <TableRow key={t.testId}>
                <TableCell>{t.testName}</TableCell>
                <TableCell>{t.subjectName}</TableCell>
                <TableCell>{t.testDescription}</TableCell>
                <TableCell>{t.timeLimitMinutes}</TableCell>
                <TableCell>
                  {new Date(t.assignedAt).toLocaleString("sk-SK")}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => router.push(`/tests/${t.testId}`)}
                    className="cursor-pointer"
                  >
                    Spustiť
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageContent>
  );
}

