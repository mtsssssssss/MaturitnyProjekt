"use client";

import { useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { TanStackFormInput } from "@/components/custom-form-inputs/form-input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { getQuestions } from "@/api/questions";
import { getUsers } from "@/api/users";
import { getSubjects } from "@/api/subjects";
import { createManualTest } from "@/api/tests";
import { ManualTestCreate } from "@/types/api/tests";
import { QuestionResponse } from "@/types/api/questions";
import { Subject } from "@/types/api/subjects";
import { UserListItem } from "@/types/api/users";
import { HelpCircle, ListChecks, Users } from "lucide-react";

export default function CreateTestPage() {
  const router = useRouter();

  const { data: subjects, isLoading: subjectsLoading } = useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const { data: questions, isLoading: questionsLoading } = useQuery<
    QuestionResponse[]
  >({
    queryKey: ["questions"],
    queryFn: getQuestions,
  });

  const { data: users, isLoading: usersLoading } = useQuery<UserListItem[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const mutation = useMutation({
    mutationFn: (data: ManualTestCreate) => createManualTest(data),
    onSuccess: ({ id }) => {
      alert("Test pridelený!");
    },
  });

  const form = useForm({
    defaultValues: {
      testName: "",
      testDescription: "",
      timeLimitMinutes: 30,
      subjectId: "",
      questionIds: [] as string[],
      assignedUserIds: [] as string[],
    } as ManualTestCreate,
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
    },
  });

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  const filteredQuestions = useMemo(() => {
    if (!questions) return [];
    if (!selectedSubjectId) return questions;
    return questions.filter((q) => q.subject.id === selectedSubjectId);
  }, [questions, selectedSubjectId]);

  if (subjectsLoading || questionsLoading || usersLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="py-6 md:py-10 space-y-8 w-full max-w-none mx-auto px-4 lg:px-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
            <ListChecks className="h-10 w-10 text-primary" />
            Vytvoriť nový test
          </h1>
          <p className="text-muted-foreground font-medium">
            Nakonfigurujte parametre a vyberte obsah testu.
          </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex-1 md:flex-none cursor-pointer"
            >
                Zrušiť
            </Button>
            <Button 
              size="lg" 
              onClick={() => form.handleSubmit()} 
              disabled={mutation.isPending}
              className="flex-1 md:flex-none shadow-lg bg-primary hover:bg-primary/90 cursor-pointer"
            >
              {mutation.isPending ? "Ukladám..." : "Vytvoriť test teraz"}
            </Button>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <Card className="border-none shadow-sm bg-muted/20">
            <CardContent className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                <form.Field
                  name="testName"
                  children={(field) => (
                    <TanStackFormInput field={field} label="Názov testu" placeholder="Napr. Záverečná skúška" />
                  )}
                />
                <form.Field
                  name="testDescription"
                  children={(field) => (
                    <TanStackFormInput field={field} label="Popis" placeholder="Info pre študentov" />
                  )}
                />
                <form.Field
                  name="timeLimitMinutes"
                  children={(field) => (
                    <TanStackFormInput field={field} type="number" label="Časový limit (min)" />
                  )}
                />
                <form.Field
                  name="subjectId"
                  children={(field) => (
                    <FieldGroup>
                      <FieldLabel>Predmet</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(v) => { field.handleChange(v); setSelectedSubjectId(v); }}
                      >
                        <SelectTrigger className="bg-background shadow-sm">
                          <SelectValue placeholder="Vyberte predmet" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects?.map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.subjectName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FieldGroup>
                  )}
                />
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" /> 
              Výber otázok 
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredQuestions.length} dostupných)
              </span>
            </h2>
          </div>
          <Card className="shadow-sm border-muted overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-20 shadow-sm">
                    <TableRow>
                      <TableHead className="w-[50px] text-center px-4">Vybrať</TableHead>
                      <TableHead className="w-[100px]">Typ</TableHead>
                      <TableHead className="w-[150px]">Kategória</TableHead>
                      <TableHead>Text otázky</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <form.Field name="questionIds" mode="array">
                      {(field) => filteredQuestions.map((q) => {
                        const isSelected = field.state.value.includes(q.id);
                        return (
                          <TableRow 
                            key={q.id}
                            className={`hover:bg-muted/30 transition-colors cursor-pointer ${isSelected ? "bg-primary/5 hover:bg-primary/10" : ""}`}
                            onClick={() => isSelected ? field.setValue(field.state.value.filter(id => id !== q.id)) : field.pushValue(q.id)}
                          >
                            <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                              <Checkbox checked={isSelected} onCheckedChange={(c) => c ? field.pushValue(q.id) : field.setValue(field.state.value.filter(id => id !== q.id))} />
                            </TableCell>
                            <TableCell>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-background uppercase">
                                    {q.questionType}
                                </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{q.subject.subjectAbbrev}</TableCell>
                            <TableCell className="font-medium">{q.questionText}</TableCell>
                          </TableRow>
                        )
                      })}
                    </form.Field>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> 
            Priradenie študentov
          </h2>
          <Card className="shadow-sm border-muted overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto overflow-y-auto max-h-[40vh]">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-20 shadow-sm">
                    <TableRow>
                      <TableHead className="w-[50px] text-center px-4">Vybrať</TableHead>
                      <TableHead>Celé meno</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead className="text-right">Rola</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <form.Field name="assignedUserIds" mode="array">
                      {(field) => users?.map((u) => {
                        const isSelected = field.state.value.includes(u.id);
                        return (
                          <TableRow 
                            key={u.id}
                            className={`hover:bg-muted/30 transition-colors cursor-pointer ${isSelected ? "bg-primary/5 hover:bg-primary/10" : ""}`}
                            onClick={() => isSelected ? field.setValue(field.state.value.filter(id => id !== u.id)) : field.pushValue(u.id)}
                          >
                            <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                              <Checkbox checked={isSelected} onCheckedChange={(c) => c ? field.pushValue(u.id) : field.setValue(field.state.value.filter(id => id !== u.id))} />
                            </TableCell>
                            <TableCell className="font-bold">{u.firstName} {u.lastName}</TableCell>
                            <TableCell className="text-muted-foreground">@{u.username}</TableCell>
                            <TableCell className="text-right text-xs uppercase font-mono">{u.role}</TableCell>
                          </TableRow>
                        )
                      })}
                    </form.Field>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="flex justify-end items-center gap-4 py-6 border-t">
            <form.Subscribe
              selector={(state) => [state.values.questionIds.length, state.values.assignedUserIds.length]}
              children={([questionCount, studentCount]) => (
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Vybraných otázok: <strong>{questionCount}</strong> | 
                  Študentov: <strong>{studentCount}</strong>
                </span>
              )}
            />
            <Button
                size="lg"
                className="w-full md:w-[300px] text-lg font-bold cursor-pointer"
                onClick={() => form.handleSubmit()}
                disabled={mutation.isPending}
            >
                {mutation.isPending ? "Vytváram..." : "Potvrdiť a uložiť"}
            </Button>
        </div>
      </div>
    </div>
  );
}