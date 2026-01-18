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
import { hashQueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSubject, createSubject, updateSubject } from "@/api/subjects";
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation'


export default function Page() {

  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams();

  const query = useQuery({
    queryKey: ["subjects", params.id],
    queryFn: () => getSubject(String(params.id)),
  })

  const updateMutation = useMutation({
    mutationFn: updateSubject,
    onSuccess: () => {
        queryClient.invalidateQueries(["subjects"]);
        router.push("/subjects")
    }
  })  

  // https://tanstack.com/form/latest/docs/framework/react/guides/async-initial-values
  const form = useForm({
    defaultValues: {
      subjectAbbrev: query.data?.subjectAbbrev ?? "",
      subjectName: query.data?.subjectName ?? "",
    },
    validators: {
      onBlur: z.object({
        subjectAbbrev: z.string().min(3, "Skratka musí mať 3 znaky").max(3, "Skratka musí mať 3 znaky"),
        subjectName: z.string().min(1, "Musíš uviesť názov predmetu"),
      }),
    },
    onSubmit: async ({ value }) => {
      updateMutation.mutate({id: String(params.id), subject: value, });
      console.log(value);
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


