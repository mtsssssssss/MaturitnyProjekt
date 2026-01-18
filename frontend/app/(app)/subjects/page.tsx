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
import Link from 'next/link'
import { useRouter } from "next/navigation";

export default function Page() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["subjects"]);
    },
  });

  return (
    <>
    <Link href="/subjects/add">+ Pridat predmet</Link>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Skratka predmetu</TableHead>
          <TableHead>Názov predmetu</TableHead>
          <TableHead>Akcie</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((subject) => {
          return (
            <TableRow key={subject.id}>
              <TableCell>{subject.subjectAbbrev}</TableCell>
              <TableCell>{subject.subjectName}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button onClick={() => router.push(`/subjects/edit/${subject.id}`)}>Editovať predmet</Button>
                  <Button disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(subject.id)} variant="destructive">Zmazať predmet</Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
        
      </TableBody>
    </Table>
    </>
  );
}
