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
import { FieldInfo } from "@/components/custom-form-inputs/field-info";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubject } from "@/api/subjects";
import { useRouter } from "next/navigation";

export default function Page() {
  const form = useForm({
    defaultValues: {
      subjectAbbrev: "",
      subjectName: "",
    },
    validators: {
      onBlur: z.object({
        subjectAbbrev: z.string().min(3, "Skratka musí mať 3 znaky").max(3, "Skratka musí mať 3 znaky"),
        subjectName: z.string().min(1, "Musíš uviesť názov predmetu"),
      }),
    },
    onSubmit: async ({ value }) => {
      postMutation.mutate(value);
      console.log(value);
    },
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  const postMutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
        queryClient.invalidateQueries(["subjects"]);
        router.push("/subjects")
    },
    onError: (e) => {
      console.log(e)
    }
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="subjectAbbrev"
          children={(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Skratka predmetu</FieldLabel>
                <Input
                  id={field.name}
                  type="text"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                ></Input>
                <FieldDescription>
                  <FieldInfo field={field} />
                </FieldDescription>
              </Field>
            );
          }}
        />

        <form.Field
          name="subjectName"
          children={(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Názov predmetu</FieldLabel>
                <Input
                  id={field.name}
                  type="text"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                ></Input>
                <FieldDescription>
                  <FieldInfo field={field} />
                </FieldDescription>
              </Field>
            );
          }}
        />

        <Field>
          <Button type="submit">Pridať predmet do databázy</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
