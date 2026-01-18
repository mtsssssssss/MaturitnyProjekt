"use client";

import CreateQuestion from "@/components/add-question-form/create-question";
import { TanStackFormInput } from "@/components/custom-form-inputs/form-input";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { CreateQuestion as CreateQuestionType } from "@/types/create-question";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { FormInput } from "@/components/custom-form-inputs/form-input";
import { z } from "zod";


export default function CreateTest() {
  const testMutation = useMutation({});

  const form = useForm({
    defaultValues: {
      testName: "",
      testTime: 0,
      testQuestions: [] as CreateQuestionType[],
    },
  });

  return (
    <Card className="w-full max-w-sm">
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <FieldGroup>
            <form.Field
              name="testName"
              children={(field) => (
                <TanStackFormInput
                  field={field}
                  label="Názov testu"
                  description="Názov testu, ktorý študenti uvidia. Zadajte niečo popisné."
                />
              )}
            ></form.Field>

            <form.Field
              name="testTime"
              children={(field) => (
                <TanStackFormInput
                  field={field}
                  label="Čas na vypracovanie (min)"
                  type="number"
                />
              )}
            ></form.Field>

            <form.Field name="testQuestions" mode="array">
              {(field) => {
                return (
                  <div>
                    {field.state.value.map((_, i) => {
                      return (
                        <div>
                        <form.Field key={i} name={`testQuestions[${i}].questionText`}>
                          {(subField) => {
                            return (
                              <TanStackFormInput field={subField} label={"Text otazky"} placeholder={"Text otazky"}  />
                            );
                          }}
                        </form.Field>
                        <form.Field key={i} name={`testQuestions[${i}].subjectId`}>
                          {(subField) => {
                            return (
                              <TanStackFormInput field={subField} label={"Text otazky"} placeholder={"Text otazky"}  />
                            );
                          }}
                        </form.Field>
                        </div>
                      );
                    })}
                    <button
                      onClick={() => field.pushValue({ questionText: ""})}
                      type="button"
                    >
                      Add person
                    </button>
                  </div>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
