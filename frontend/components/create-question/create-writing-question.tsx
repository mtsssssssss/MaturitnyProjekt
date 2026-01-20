"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { TanStackFormInput } from "../custom-form-inputs/form-input";
import { TanStackFormSelect } from "../custom-form-inputs/form-select";
import { Button } from "../ui/button";
import { getSubjects } from "@/api/subjects";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createQuestion } from "@/api/questions";
import { log } from "console";
import { useRouter } from "next/navigation";
import { CreateEditQuestion } from "@/types/api/questions";

export default function CreateWritingQuestion() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      questionText: "",
      subjectId: "",
      questionType: 2,
      answer: "",
    },
    validators: {
      onBlur: z.object({
        questionText: z
          .string()
          .min(5, "Otázka musí mať minimálne 5 znakov")
          .max(1000, "Otázka musí mať maximálne 1000 znakov"),
        subjectId: z.uuid("Vyber predmet"),
        questionType: z.literal(2),
        answer: z.string().min(1, "Odpoveď musí mať minimálne 1 znak"),
      }),
    },
    onSubmit: async ({ value }: {value: CreateEditQuestion}) => {
      mutation.mutate(value);
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const options = data?.map((subject: any) => ({
    key: subject.id,
    value: subject.id,
    text: subject.subjectName,
  }));

  const mutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries(["questions"]);
      router.push("/questions");
    },
    onError: () => {
      console.log("Error pri vytvarani writing otazky");
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
        <form.Field
          name="questionText"
          children={(field) => (
            <TanStackFormInput field={field} label="Text otázky" />
          )}
        />

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

        <form.Field
          name="answer"
          children={(field) => (
            <TanStackFormInput field={field} label="Správna odpoveď" />
          )}
        />

        <Button type="submit" className="mt-4">
          Pridať otázku
        </Button>
      </FieldGroup>
    </form>
  );
}
