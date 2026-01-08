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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldInfo } from "@/components/field-info";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { getSubjects } from "@/api/subjects/getSubjects";
import { useState } from "react";
import { createTest, TestCreate } from "@/api/createTest";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

const base = {
  questionText: z.string().min(5).max(1000),
  subjectId: z.uuid(),
};




export default function Page() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: TestCreate) => createTest(data),
    onSuccess: (response: { id: string }) => {
      // napríklad presmerovanie na stránku s testom podľa id
      router.push(`/test/${response.id}`);
    },
  });

  const schema = z
  .object({
    questionText: z.string().min(5).max(1000),
    subjectId: z.uuid(),
    questionType: z.enum(["abcd", "writing"]),
    abcdAnswers: z.array(
      z.object({
        text: z.string(),
        isCorrect: z.boolean(),
      })
    ),
    writingAnswer: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.questionType === "abcd") {
      if (data.abcdAnswers.length < 2) {
        ctx.addIssue({
          path: ["abcdAnswers"],
          message: "Musí existovať aspoň 2 odpovede",
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.abcdAnswers.filter((a) => a.isCorrect).length !== 1) {
        ctx.addIssue({
          path: ["abcdAnswers"],
          message: "Musí existovať presne jedna správna odpoveď",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (data.questionType === "writing") {
      if (!data.writingAnswer.trim()) {
        ctx.addIssue({
          path: ["writingAnswer"],
          message: "Odpoveď nesmie byť prázdna",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });


  const form = useForm({
    defaultValues: {
      questionText: "",
      subjectId: "",
      questionType: "",
      abcdAnswers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
      writingAnswer: "",
    },

    validators: {
      onSubmit: schema,
    },
   
    onSubmit: async ({ value }) => {
      // mutation.mutate(value);
      console.log(value);
    },
  });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
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
                <form.Field
                  name="questionText"
                  children={(field) => {
                    return (
                      <>
                        <Field>
                          <FieldLabel htmlFor={field.name}>
                            Text otázky
                          </FieldLabel>
                          <Textarea
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          ></Textarea>
                        </Field>
                        <FieldDescription>
                          <FieldInfo field={field} />
                        </FieldDescription>
                      </>
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
                            Priraď otázku k predmetu
                          </FieldDescription>
                        </Field>

                        <FieldInfo field={field} />
                      </>
                    );
                  }}
                />

                <form.Field
                  name="questionType"
                  children={(field) => {
                    return (
                      <>
                        <Field>
                          <FieldLabel htmlFor={field.name}>
                            Typ otázky
                          </FieldLabel>

                          <Select
                            value={field.state.value}
                            onValueChange={(value) => field.handleChange(value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Vyber predmet" />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value={"abcd"}>
                                  Abcd odpoveď
                                </SelectItem>
                                <SelectItem value={"writing"}>
                                  Doplňovacia odpoveď
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>

                          <FieldDescription>
                            Priraď otázku k predmetu
                          </FieldDescription>
                        </Field>

                        <FieldInfo field={field} />
                      </>
                    );
                  }}
                />

                <form.Subscribe selector={(state) => state.values.questionType}>
                  {(questionType) => (
                    <>
                      {questionType === "abcd" && (
                        <form.Field name="abcdAnswers">
                          {(field) => (
                            <>
                              <FieldLabel>Odpovede</FieldLabel>

                              <div className="space-y-2">
                                {field.state.value.map((_, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-2 items-center"
                                  >
                                    <Input
                                      placeholder={`Odpoveď ${index + 1}`}
                                      value={field.state.value[index].text}
                                      onChange={(e) => {
                                        const copy = [...field.state.value];
                                        copy[index].text = e.target.value;
                                        field.handleChange(copy);
                                      }}
                                    />

                                    <input
                                      type="radio"
                                      name="correctAnswer"
                                      checked={
                                        field.state.value[index].isCorrect
                                      }
                                      onChange={() => {
                                        const copy = field.state.value.map(
                                          (a, i) => ({
                                            ...a,
                                            isCorrect: i === index,
                                          })
                                        );
                                        field.handleChange(copy);
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    field.handleChange([
                                      ...field.state.value,
                                      { text: "", isCorrect: false },
                                    ])
                                  }
                                >
                                  Pridať odpoveď
                                </Button>

                                {field.state.value.length > 2 && (
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() =>
                                      field.handleChange(
                                        field.state.value.slice(0, -1)
                                      )
                                    }
                                  >
                                    Odstrániť poslednú
                                  </Button>
                                )}
                              </div>

                              <FieldDescription>
                                Vyber presne jednu správnu odpoveď
                              </FieldDescription>

                              <FieldInfo field={field} />
                            </>
                          )}
                        </form.Field>
                      )}

                      {questionType === "writing" && (
                        <form.Field
                          name="writingAnswer"
                          children={(field) => {
                            return (
                              <>
                                <Field>
                                  <FieldLabel htmlFor={field.name}>
                                    Vlož správnu odpoveď pre túto otázku
                                  </FieldLabel>
                                  <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    type="text"
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                  ></Input>
                                </Field>
                                <FieldDescription>
                                  <FieldInfo field={field} />
                                </FieldDescription>
                              </>
                            );
                          }}
                        />
                      )}
                    </>
                  )}
                </form.Subscribe>

                <Field>
                  <Button disabled={mutation.isPending} type="submit">
                    Vložiť otázku do databázy!
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


/*

 validators: {
      onSubmit: z.object({
        questionText: z
          .string()
          .min(5, "Otázka musí mať aspoň 5 znakov.")
          .max(1000, "Otázka musí mať maximálne 1000 znakov."),
        subjectId: z.uuid(),
        questionType: z.enum(["abcd", "writing"]),
        abcdAnswers: z.array(
          z.object({
            text: z.string().min(1, "Odpoveď nesmie byť prázdna"),
            isCorrect: z.boolean(),
          })
        ),
        writingAnswer: z.string().min(1),
      }),
    },

*/