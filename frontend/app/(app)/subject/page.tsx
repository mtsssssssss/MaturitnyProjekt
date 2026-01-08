"use client";

import { deleteSubject } from "@/api/subjects/deleteSubject";
import { getSubjects } from "@/api/subjects/getSubjects";
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
                  <Button onClick={() => router.push(`/subject/edit/${subject.id}`)}>Editovať predmet</Button>
                  <Button disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(subject.id)} variant="destructive">Zmazať predmet</Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
        
      </TableBody>
    </Table>
  );
}
