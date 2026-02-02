"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyAttempts } from "@/api/tests";
import { AttemptResultListItem } from "@/types/api/tests";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AttemptsChart } from "@/components/stats/attempts-chart";
import { AttemptsTable } from "@/components/stats/attempts-table";
import { PageContent } from "@/lib/page-content";
import { PageHeading, PageSectionHeading } from "@/components/ui/page-heading";
import { aggregateBySubject } from "@/lib/stats";
import { Card } from "@/components/ui/card";
import { BarChart2, ListOrdered } from "lucide-react";

export default function StatsPage() {
  const { data, isLoading } = useQuery<AttemptResultListItem[]>({
    queryKey: ["my-attempts"],
    queryFn: getMyAttempts,
  });

  const chartData = aggregateBySubject(data ?? []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <PageContent>
      <PageHeading
        icon={BarChart2}
        title="Moje štatistiky testov"
        subtitle="Prehľad dokončených testov a úspešnosti podľa predmetov."
      />

      {chartData.length > 0 && (
        <Card className="overflow-hidden">
          <PageSectionHeading
            icon={BarChart2}
            title="Úspešnosť podľa predmetov"
            subtitle="Priemerná percentuálna úspešnosť v jednotlivých predmetoch."
          />
          <div className="p-4 sm:p-6">
            <AttemptsChart data={chartData} />
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <PageSectionHeading
          icon={ListOrdered}
          title="Prehľad dokončených testov"
          subtitle="Jednotlivé pokusy s výsledkami a percentuálnou úspešnosťou."
        />
        <div className="pt-4">
          <AttemptsTable data={data ?? []} />
        </div>
      </Card>
    </PageContent>
  );
}
