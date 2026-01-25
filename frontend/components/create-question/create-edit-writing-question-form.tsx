"use client";

import { useForm } from "@tanstack/react-form";
import { FieldGroup } from "../ui/field";
import { TanStackFormInput } from "../custom-form-inputs/form-input";
import { TanStackFormSelect } from "../custom-form-inputs/form-select";
import { Button } from "../ui/button";
import { getSubjects } from "@/api/subjects";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createQuestion, getQuestion, updateQuestion } from "@/api/questions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CreateEditQuestion } from "@/types/api/questions";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loader2, Save, Undo2, Type } from "lucide-react";

export default function QuestionWritingForm({ id }: { id?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const { data: questionData, isLoading: questionFetching } = useQuery({
    queryKey: ["questions", id],
    queryFn: () => getQuestion(id!),
    enabled: isEdit,
  });

  const subjectOptions = subjects?.map((s: any) => ({
    key: s.id,
    value: s.id,
    text: s.subjectName,
  }));

  const mutation = useMutation({
    mutationFn: (values: CreateEditQuestion) =>{
      console.log(values)
      return isEdit ? updateQuestion(id!, values) : createQuestion(values);
    },      
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      router.push("/questions");
    },
  });

  const form = useForm({
    defaultValues: {
      questionText: "",
      subjectId: "",
      questionType: 2,
      answer: "",
      abcdAnswers: [],
    } as CreateEditQuestion,
    onSubmit: async ({ value }) => mutation.mutate(value),
  });

  useEffect(() => {
  if (questionData) {
    form.reset({
      questionText: questionData.questionText,
      subjectId: questionData.subject.id, 
      questionType: 2,
      answer: questionData.answer,
    });
  }
}, [questionData, form]);

  if (isEdit && questionFetching) {
    return (
      <div className="flex h-48 items-center justify-center w-full">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto py-6 px-4">
      <Card className="shadow-md border-slate-200 bg-white">
        <CardHeader className="bg-slate-50/50 border-b py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Type className="h-5 w-5 text-orange-600" />
            </div>
            <CardTitle className="text-xl font-bold text-slate-900">
              {isEdit ? "Upraviť otázku" : "Nová otázka"}
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <FieldGroup className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <form.Field
                  name="subjectId"
                  children={(field) => (
                    <TanStackFormSelect
                      field={field}
                      label="Predmet"
                      options={subjectOptions}
                      placeholder={subjectsLoading ? "Načítavam..." : (questionData?.subject?.subjectName || "Vyberte predmet")}
                    />
                  )}
                />

                <form.Field
                  name="questionText"
                  children={(field) => (
                    <TanStackFormInput 
                      field={field} 
                      label="Znenie otázky" 
                      placeholder="Zadajte text..." 
                    />
                  )}
                />

                <form.Field
                  name="answer"
                  children={(field) => (
                    <TanStackFormInput 
                      field={field} 
                      label="Správna odpoveď" 
                      placeholder="Zadajte riešenie..." 
                    />
                  )}
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-orange-600 hover:bg-orange-700 h-10 px-6"
                >
                  {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isEdit ? "Uložiť" : "Vytvoriť"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push("/questions")}
                  className="h-10 text-slate-500"
                >
                  <Undo2 className="mr-2 h-4 w-4" />
                  Zrušiť
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}