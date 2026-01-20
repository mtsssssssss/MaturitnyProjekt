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
import {
  CreateEditAbcdAnswer,
  CreateEditQuestion,
} from "@/types/api/questions";

export default function CreateAbcdQuestion() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      questionText: "",
      subjectId: "",
      questionType: 1, // 1 = ABCD
      abcdAnswers: [] as CreateEditAbcdAnswer[],
    },
    onSubmit: async ({ value }: { value: CreateEditQuestion }) => {
      mutation.mutate(value);
    },
  });

  // Fetch subjects
  const { data, isLoading, error } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const options = data?.map((subject: any) => ({
    key: subject.id,
    value: subject.id,
    text: subject.subjectName,
  }));

  // Mutation pre vytvorenie otázky
  const mutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries(["questions"]);
      router.push("/questions");
    },
    onError: () => {
      console.log("Error pri vytvarani ABCD otázky");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        {/* Text otázky */}
        <form.Field
          name="questionText"
          children={(field) => (
            <TanStackFormInput field={field} label="Text otázky" />
          )}
        />

        {/* Predmet */}
        <form.Field
          name="subjectId"
          children={(field) => (
            <TanStackFormSelect
              field={field}
              label="Predmet"
              options={options}
              placeholder={isLoading ? "Načítavam..." : "Vyber predmet"}
              description={error ? "Nepodarilo sa načítať predmety" : undefined}
            />
          )}
        />

        {/* ABCD odpovede */}
        <form.Field name="abcdAnswers" mode="array">
          {(field) => {
            const values = field.state.value || [];

            const handleRightChange = (index: number) => {
              const newValues: CreateEditAbcdAnswer[] = values.map((v, i) => ({
                ...v,
                isRight: i === index, // len kliknutý index je true
              }));
              field.setValue(newValues);
            };

            return (
              <div className="flex flex-col gap-2">
                {values.map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <form.Field name={`abcdAnswers[${i}].answer`}>
                      {(subField) => (
                        <TanStackFormInput
                          field={subField}
                          label={`Odpoveď ${i + 1}`}
                        />
                      )}
                    </form.Field>

                    <form.Field name={`abcdAnswers[${i}].isRight`}>
                      {(subField) => (
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name={subField.name} // všetky radiá majú rovnaký name
                            checked={values[i].isRight}
                            onChange={() => handleRightChange(i)}
                          />
                          Správna
                        </label>
                      )}
                    </form.Field>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={() =>
                    field.pushValue({ answer: "", isRight: false })
                  }
                  className="mt-2"
                >
                  Pridať odpoveď
                </Button>
              </div>
            );
          }}
        </form.Field>

        <Button type="submit" className="mt-4">
          Pridať otázku
        </Button>
      </FieldGroup>
    </form>
  );
}
