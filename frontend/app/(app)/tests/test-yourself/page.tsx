"use client";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldInfo } from "@/components/custom-form-inputs/field-info";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { getSubjects } from "@/api/subjects";
import { createTest, TestCreate } from "@/api/tests/createTest";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { TanStackFormInput } from "@/components/custom-form-inputs/form-input";

export default function Page() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: TestCreate) => createTest(data),
    onSuccess: (response: { id: string }) => {
      router.push(`/test/${response.id}`);
    },
  });

  const form = useForm({
    defaultValues: {
      time: 1,
      subjectId: "",
    },
    validators: {
      onChange: z.object({
        time: z
          .number()
          .min(1, "Číslo musí byť väčšie ako 0!")
          .max(60, "Číslo musí byť menšie ako 60!"),
        subjectId: z.uuid("Vyber si predmet z ktorého sa chceš otestovať!"),
      }),
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
      console.log(value);
    },
  });

  return (
    <div className="flex h-full w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>
              Vytvor si test z náhodne vybraných otázok z databázy a otestuj sa!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                {/* A type-safe field component*/}
                <form.Field
                  name="time"
                  children={(field) => {
                    // Avoid hasty abstractions. Render props are great!
                    return (
                      <TanStackFormInput field={field} type="number" label="Čas na vypracovanie testu (min)"  />
                    );
                  }}
                />

                <form.Field
                  name="subjectId"
                  children={(field) => {
                    return (
                      <>
                        <Field>
                          <FieldLabel htmlFor={field.name}>Predmet</FieldLabel>

                          <Select
                            disabled={isLoading || !!error}
                            value={field.state.value}
                            onValueChange={(value) => field.handleChange(value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Vyber predmet" />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectGroup>
                                {data?.map((predmet) => (
                                  <SelectItem
                                    key={predmet.id}
                                    value={predmet.id.toString()}
                                  >
                                    {predmet.subjectAbbrev} |{" "}
                                    {predmet.subjectName}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>

                          <FieldDescription>
                            Vyber si predmet z ktorého sa chceš otestovať!
                            <FieldInfo field={field} />
                          </FieldDescription>
                        </Field>
                      </>
                    );
                  }}
                />

                <Field>
                  <Button disabled={mutation.isPending} type="submit">
                    Otestovať sa!
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
