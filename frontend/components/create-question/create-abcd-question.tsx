"use client";

import { useForm } from "@tanstack/react-form";
import { FieldGroup } from "../ui/field";
import { TanStackFormInput } from "../custom-form-inputs/form-input";
import { TanStackFormSelect } from "../custom-form-inputs/form-select";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getSubjects } from "@/api/subjects";
import { createQuestion } from "@/api/questions";
import { CreateEditQuestion } from "@/types/api/questions";

export default function CreateAbcdQuestion() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. Query pre predmety
  const { data: subjects, isLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const subjectOptions = subjects?.map((s: any) => ({
    key: s.id,
    value: s.id,
    text: s.subjectName,
  }));

  // 2. Mutation pre API
  const mutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      router.push("/questions");
    },
  });

  // 3. Definícia formulára
  const form = useForm({
    defaultValues: {
      questionText: "",
      subjectId: "",
      questionType: 1,
      abcdAnswers: [
        { answer: "", isRight: true }, // Začneme s jednou správnou
        { answer: "", isRight: false },
      ],
    } as CreateEditQuestion,
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6 p-4 border rounded-lg bg-white shadow-sm"
    >
      <h2 className="text-xl font-bold">Nová ABCD otázka</h2>

      <FieldGroup>
        {/* Text otázky */}
        <form.Field
          name="questionText"
          validators={{
            onChange: ({ value }) =>
              !value ? "Text otázky je povinný" : undefined,
          }}
          children={(field) => (
            <TanStackFormInput field={field} label="Text otázky" />
          )}
        />

        {/* Výber predmetu */}
        <form.Field
          name="subjectId"
          validators={{
            onChange: ({ value }) => (!value ? "Vyberte predmet" : undefined),
          }}
          children={(field) => (
            <TanStackFormSelect
              field={field}
              label="Predmet"
              options={subjectOptions || []}
              placeholder={isLoading ? "Načítavam..." : "Vyberte predmet"}
            />
          )}
        />

        <hr className="my-4" />

        {/* Sekcia odpovedí */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Možnosti odpovedí</h3>
            <span className="text-xs text-gray-500 italic">
              Označte práve jednu správnu
            </span>
          </div>

          <form.Field name="abcdAnswers" mode="array">
            {(field) => {
              // 1. Fix pre 'possibly undefined' - vytiahneme si hodnotu bezpečne
              const answers = field.state.value ?? [];

              return (
                <div className="flex flex-col gap-4">
                  {answers.map((_, i) => (
                    <div
                      key={`answer-${i}`}
                      className="flex items-end gap-3 p-3 bg-slate-50 rounded-md relative"
                    >
                      <div className="flex-1">
                        <form.Field name={`abcdAnswers[${i}].answer`}>
                          {(subField) => (
                            <TanStackFormInput
                              field={subField}
                              label={`Možnosť ${String.fromCharCode(65 + i)}`}
                            />
                          )}
                        </form.Field>
                      </div>

                      <form.Field name={`abcdAnswers[${i}].isRight`}>
                        {(subField) => (
                          <div className="flex flex-col items-center mb-2">
                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1">
                              Správna
                            </label>
                            <input
                              type="radio"
                              name="isRightSelection"
                              className="w-5 h-5 accent-green-600 cursor-pointer"
                              checked={subField.state.value}
                              onChange={() => {
                                // Získame aktuálne hodnoty všetkých odpovedí priamo z poľa
                                const currentAnswers = field.state.value ?? [];

                                // Vytvoríme nové pole, kde zachováme text ('answer'),
                                // ale zmeníme len 'isRight'
                                const updatedAnswers = currentAnswers.map(
                                  (ans, idx) => ({
                                    ...ans,
                                    isRight: idx === i,
                                  }),
                                );

                                // Naraz aktualizujeme celé pole odpovedí
                                field.setValue(updatedAnswers);
                              }}
                            />
                          </div>
                        )}
                      </form.Field>

                      {/* 1. Fix pre 'possibly undefined' pri length */}
                      {answers.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 mb-1"
                          onClick={() => field.removeValue(i)}
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      field.pushValue({ answer: "", isRight: false })
                    }
                    className="self-start border-dashed"
                  >
                    + Pridať ďalšiu možnosť
                  </Button>
                </div>
              );
            }}
          </form.Field>
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
        >
          {mutation.isPending ? "Ukladám..." : "Vytvoriť a publikovať otázku"}
        </Button>
      </FieldGroup>
    </form>
  );
}
