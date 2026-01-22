"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Shadcn Select
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSubjects } from "@/api/subjects"; // Tvoja funkcia na list predmetov
import { createQuestion, updateQuestion, getQuestion } from "@/api/questions";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

export default function QuestionForm({ id }: { id?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  // 1. Načítame všetky PREDMETY z DB pre Select
  const subjectsQuery = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  // 2. Načítame samotnú OTÁZKU (len pri edite)
  const questionQuery = useQuery({
    queryKey: ["questions", id],
    queryFn: () => getQuestion(id!),
    enabled: isEditMode,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      router.push("/questions");
    },
  };

  const createMutation = useMutation({ mutationFn: createQuestion, ...mutationOptions });
  const updateMutation = useMutation({ 
    mutationFn: (data: any) => updateQuestion(id!, data), 
    ...mutationOptions 
  });

  const form = useForm({
    defaultValues: {
      questionText: questionQuery.data?.questionText ?? "",
      subjectId: questionQuery.data?.subjectId ?? "", // ID vybraného predmetu
    },
    onSubmit: async ({ value }) => {
      isEditMode ? updateMutation.mutate(value) : createMutation.mutate(value);
    },
  });

  if (questionQuery.isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="w-full md:w-[85%] mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold">
        {isEditMode ? "Upraviť otázku" : "Nová otázka"}
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="bg-white p-8 border rounded-2xl shadow-sm space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* VÝBER PREDMETU Z DB */}
          <div className="md:col-span-1">
            <form.Field
              name="subjectId"
              children={(field) => (
                <Field>
                  <FieldLabel>Priradiť k predmetu</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                    disabled={subjectsQuery.isLoading}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={subjectsQuery.isLoading ? "Načítavam..." : "Vyberte predmet"} />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectsQuery.data?.map((subject: any) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.subjectAbbrev} - {subject.subjectName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {subjectsQuery.isError && (
                    <p className="text-destructive text-xs mt-1">Chyba pri načítaní predmetov</p>
                  )}
                </Field>
              )}
            />
          </div>

          {/* TEXT OTÁZKY */}
          <div className="md:col-span-3">
            <form.Field
              name="questionText"
              children={(field) => (
                <Field>
                  <FieldLabel>Znenie otázky</FieldLabel>
                  <Input
                    placeholder="Napíšte otázku..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-12"
                  />
                </Field>
              )}
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="h-14 px-10 font-bold">
          <Save className="mr-2 h-5 w-5" />
          {isEditMode ? "Uložiť zmeny" : "Vytvoriť otázku"}
        </Button>
      </form>
    </div>
  );
}