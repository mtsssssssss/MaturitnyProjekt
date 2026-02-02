"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudentAttempts } from "@/api/tests";
import { StudentAttemptResultListItem } from "@/types/api/tests";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AttemptsChart } from "@/components/stats/attempts-chart";
import { StudentAttemptsTable } from "@/components/stats/student-attempts-table";
import { PageContent } from "@/lib/page-content";
import { PageHeading, PageSectionHeading } from "@/components/ui/page-heading";
import { aggregateBySubject } from "@/lib/stats";
import { Card } from "@/components/ui/card";
import { BarChart3, ListOrdered } from "lucide-react";

export default function ResultsPage() {
  const { data, isLoading } = useQuery<StudentAttemptResultListItem[]>({
    queryKey: ["student-attempts"],
    queryFn: getStudentAttempts,
  });

  const chartData = aggregateBySubject(data ?? []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <PageContent>
      <PageHeading
        icon={BarChart3}
        title="Výsledky žiakov"
        subtitle="Prehľad výsledkov žiakov a priemerná úspešnosť podľa predmetov."
      />

      {chartData.length > 0 && (
        <Card className="overflow-hidden">
          <PageSectionHeading
            icon={BarChart3}
            title="Priemerná úspešnosť podľa predmetov"
            subtitle="Súhrn percentuálnej úspešnosti žiakov v jednotlivých predmetoch."
          />
          <div className="p-4 sm:p-6">
            <AttemptsChart data={chartData} />
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <PageSectionHeading
          icon={ListOrdered}
          title="Detail výsledkov žiakov"
          subtitle="Jednotlivé pokusy žiakov s percentuálnou úspešnosťou."
        />
        <div className="pt-4">
          <StudentAttemptsTable data={data ?? []} />
        </div>
      </Card>
    </PageContent>
  );
}
