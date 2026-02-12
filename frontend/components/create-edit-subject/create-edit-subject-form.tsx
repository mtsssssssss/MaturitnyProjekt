"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { TanStackFormInput } from "../custom-form-inputs/form-input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSubject, createSubject, updateSubject, getSubjects } from "@/api/subjects";
import { useRouter } from "next/navigation";
import { Save, Undo2, BookOpen } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CreateEditSubject } from "@/types/api/subjects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export default function SubjectForm({ id }: { id?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data, isLoading: isFetching } = useQuery({
    queryKey: ["subjects", id],
    queryFn: () => getSubject(id!),
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: (values: CreateEditSubject) =>
      isEdit
        ? updateSubject({ id: id!, subject: values })
        : createSubject(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      router.push("/subjects");
    },
  });

  const form = useForm({
    defaultValues: {
      subjectAbbrev: data?.subjectAbbrev ?? "",
      subjectName: data?.subjectName ?? "",
    } as CreateEditSubject,
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
    },
    validators: {
      onBlur: z.object({
        subjectAbbrev: z.string().length(3, "Skratka musí mať presne 3 znaky"),
        subjectName: z.string()
      }),
      onChange:z.object({
        subjectAbbrev: z.string(),
        subjectName: z.string().min(1, "Názov predmetu je povinný"),
      }),
    },
  });

  
  useEffect(() => {
    if (data) {
      form.reset({
        subjectAbbrev: data.subjectAbbrev,
        subjectName: data.subjectName,
      });
    }
  }, [data, form]);


  if (isEdit && isFetching) {
    return <LoadingSpinner fullscreen={false} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-10 px-4">
      <Card className="shadow-lg border-border w-full bg-card">
        <CardHeader className="space-y-4 bg-muted/30 border-b p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                {isEdit ? "Upraviť predmet" : "Nový predmet"}
              </CardTitle>
              <CardDescription>
                {isEdit 
                  ? "Upravte údaje existujúceho predmetu." 
                  : "Pridajte nový vyučovací predmet do systému."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-6"
          >
            <div className="space-y-6 w-full">
              <form.Field
                name="subjectAbbrev"
                children={(field) => (
                  <TanStackFormInput
                    field={field}
                    label="Skratka predmetu"
                    placeholder="Napr. MAT"
                  />
                )}
              />

              <form.Field
                name="subjectName"
                children={(field) => (
                  <TanStackFormInput
                    field={field}
                    label="Názov predmetu"
                    placeholder="Napr. Matematika"
                  />
                )}
              />
            </div>

            <div className="flex items-center gap-4 pt-6 border-t mt-4">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 h-11"
              >
                <Save className="mr-2 h-4 w-4" />
                {isEdit ? "Uložiť zmeny" : "Vytvoriť predmet"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/subjects")}
                className="h-11 px-6 text-slate-600"
              >
                <Undo2 className="mr-2 h-4 w-4" />
                Zrušiť
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}