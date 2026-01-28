"use client";

import { getSubjects, deleteSubject } from "@/api/subjects";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, LayoutGrid } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PageContent } from "@/lib/page-content";
import { PageHeading } from "@/components/ui/page-heading";

export default function Page() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <PageContent>
      <PageHeading
        icon={LayoutGrid}
        title="Správa predmetov"
        subtitle="Kompletný zoznam dostupných maturitných predmetov."
        actions={
          <Button asChild size="lg" className="h-12 px-6 cursor-pointer shrink-0">
            <Link href="/subjects/add" className="flex items-center gap-2 text-base cursor-pointer">
              <Plus className="h-5 w-5" /> Pridať nový predmet
            </Link>
          </Button>
        }
      />

      <div className="hidden md:block border rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow>
              <TableHead className="w-[15%] py-5 px-6 font-bold text-slate-600">
                Kód / Skratka
              </TableHead>
              <TableHead className="w-[65%] py-5 px-6 font-bold text-slate-600">
                Názov predmetu
              </TableHead>
              <TableHead className="w-[20%] text-right py-5 px-6 font-bold text-slate-600">
                Akcie
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((subject) => (
              <TableRow
                key={subject.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <TableCell className="px-6 py-4">
                  <code className="bg-slate-100 text-primary px-3 py-1.5 rounded-md font-bold border">
                    {subject.subjectAbbrev}
                  </code>
                </TableCell>
                <TableCell className="px-6 py-4 text-lg font-medium">
                  {subject.subjectName}
                </TableCell>
                <TableCell className="text-right px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/subjects/edit/${subject.id}`)
                      }
                      className="cursor-pointer"
                    >
                      <Pencil className="h-4 w-4 mr-2" /> Upraviť
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deleteMutation.isPending}
                      onClick={() =>
                        confirm(`Zmazať ${subject.subjectName}?`) &&
                        deleteMutation.mutate(subject.id)
                      }
                      className="cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Zmazať
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data?.map((subject) => (
          <div
            key={subject.id}
            className="border rounded-xl p-4 bg-card shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="font-mono font-bold text-primary">
                {subject.subjectAbbrev}
              </span>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => router.push(`/subjects/edit/${subject.id}`)}
                  className="cursor-pointer"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive cursor-pointer"
                  onClick={() => deleteMutation.mutate(subject.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <h3 className="text-lg font-semibold">{subject.subjectName}</h3>
          </div>
        ))}
      </div>
    </PageContent>
  );
}
