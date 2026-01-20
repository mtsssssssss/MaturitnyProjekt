"use client";

import { deleteQuestion } from "@/api/questions/deleteQuestion";
import { getQuestions } from "@/api/questions/getQuestions";
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
    queryKey: ["questions"],
    queryFn: getQuestions,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["questions"]);
    },
  });

  return (
    <>
    <Link href="/questions/add">+ Pridať otázku</Link>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Text otázky</TableHead>
          <TableHead>Typ otázky</TableHead>
          <TableHead>Akcie</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((question) => {
          return (
            <TableRow key={question.id}>
              <TableCell>{question.questionText}</TableCell>
              <TableCell>{question.questionType === "Abcd" ? "ABCD" : "Doplňovacia"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button onClick={() => router.push(`/question/edit/${question.id}`)}>Editovať otázku</Button>
                  <Button disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(question.id)} variant="destructive">Zmazať otázku</Button>
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
