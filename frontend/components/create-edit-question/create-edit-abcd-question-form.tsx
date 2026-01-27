"use client";

import { useForm } from "@tanstack/react-form";
import { FieldGroup } from "../ui/field";
import { TanStackFormInput } from "../custom-form-inputs/form-input";
import { TanStackFormSelect } from "../custom-form-inputs/form-select";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSubjects } from "@/api/subjects";
import { createQuestion, getQuestion, updateQuestion } from "@/api/questions";
import { CreateEditQuestion } from "@/types/api/questions";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Save, Undo2, ListChecks, Plus, Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function QuestionAbcdForm({ id }: { id?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  // 1. Query pre predmety
  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const subjectOptions = subjects?.map((s: any) => ({
    key: s.id,
    value: s.id,
    text: s.subjectName,
  }));

  // 2. Fetch existujúcej otázky (Edit mode)
  const { data: questionData, isLoading: questionFetching } = useQuery({
    queryKey: ["questions", id],
    queryFn: () => getQuestion(id!),
    enabled: isEdit,
  });

  // 3. Mutation pre API (Add alebo Update)
  const mutation = useMutation({
    mutationFn: (values: CreateEditQuestion) =>
      isEdit ? updateQuestion(id!, values) : createQuestion(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      router.push("/questions");
    },
  });

  // 4. Definícia formulára
  const form = useForm({
    defaultValues: {
      questionText: "",
      subjectId: "",
      questionType: 1, 
      abcdAnswers: [
        { answer: "", isRight: true },
        { answer: "", isRight: false },
        { answer: "", isRight: false },
        { answer: "", isRight: false },
      ],
      answer: null,
    } as CreateEditQuestion,
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
    },
  });

  useEffect(() => {
    if (questionData) {
      form.reset({
        questionText: questionData.questionText,
        subjectId: questionData.subject.id,
        questionType: 1,
        abcdAnswers:
          questionData.abcdAnswers?.map((ans: any) => ({
            answer: ans.answer,
            isRight: ans.isRight,
          })) ?? [],
      });
    }
  }, [questionData, form]);

  if (isEdit && questionFetching) {
    return <LoadingSpinner fullscreen={false} />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-4">
      <Card className="shadow-lg border-slate-200 bg-white">
        <CardHeader className="bg-slate-50/50 border-b py-3 px-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ListChecks className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900">
              {isEdit ? "Upraviť ABCD otázku" : "Nová ABCD otázka"}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup className="space-y-6">
              {/* Sekcia: Základné info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <form.Field
                    name="subjectId"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? "Vyberte predmet" : undefined,
                    }}
                    children={(field) => (
                      <TanStackFormSelect
                        field={field}
                        label="Predmet"
                        options={subjectOptions || []}
                        placeholder={
                          subjectsLoading ? "Načítavam..." : (questionData?.subject?.subjectName || "Vyberte predmet")
                        }
                      />
                    )}
                  />
                </div>
                <div className="md:col-span-2">
                  <form.Field
                    name="questionText"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? "Text otázky je povinný" : undefined,
                    }}
                    children={(field) => (
                      <TanStackFormInput
                        field={field}
                        label="Text otázky"
                        placeholder="Zadajte znenie..."
                      />
                    )}
                  />
                </div>
              </div>

              {/* Sekcia: Odpovede */}
              <div className="space-y-4 pt-2">
                <form.Field name="abcdAnswers" mode="array">
                  {(field) => {
                    const answers = field.state.value ?? [];
                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <h3 className="text-sm font-bold uppercase text-slate-500 tracking-tight">
                            Možnosti odpovedí
                          </h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              field.pushValue({ answer: "", isRight: false })
                            }
                            className="h-8 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Pridať možnosť
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {answers.map((_, i) => (
                            <div
                              key={`answer-${i}`}
                              className="flex items-start gap-3 p-3 bg-slate-50/50 border rounded-xl relative group transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300"
                            >
                              <div className="flex-1 min-w-0">
                                <form.Field name={`abcdAnswers[${i}].answer`}>
                                  {(subField) => (
                                    <TanStackFormInput
                                      field={subField}
                                      label={`Možnosť ${String.fromCharCode(65 + i)}`}
                                    />
                                  )}
                                </form.Field>
                              </div>

                              <div className="flex flex-col items-center pt-6">
                                <form.Field name={`abcdAnswers[${i}].isRight`}>
                                  {(subField) => (
                                    <div className="flex flex-col items-center">
                                      <label className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                                        Ok
                                      </label>
                                      <input
                                        type="radio"
                                        name="isRightSelection"
                                        className="w-5 h-5 accent-blue-600 cursor-pointer"
                                        checked={subField.state.value}
                                        onChange={() => {
                                          const currentAnswers =
                                            field.state.value ?? [];
                                          const updatedAnswers =
                                            currentAnswers.map((ans, idx) => ({
                                              ...ans,
                                              isRight: idx === i,
                                            }));
                                          field.setValue(updatedAnswers);
                                        }}
                                      />
                                    </div>
                                  )}
                                </form.Field>

                                {answers.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => field.removeValue(i)}
                                    className="mt-3 text-slate-300 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }}
                </form.Field>
              </div>

              {/* Akcie */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push("/questions")}
                  className="text-slate-500 h-10"
                >
                  <Undo2 className="mr-2 h-4 w-4" /> Zrušiť
                </Button>

                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-8 shadow-md shadow-blue-100"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isEdit ? "Uložiť zmeny" : "Vytvoriť otázku"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
