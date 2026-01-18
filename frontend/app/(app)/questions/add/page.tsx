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
import { Textarea } from "@/components/ui/textarea";
import { FieldInfo } from "@/components/custom-form-inputs/field-info";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postQuestion } from "@/api/questions/createQuestion";
import { useRouter } from "next/navigation";
import { getSubjects } from "@/api/subjects/getSubjects";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const form = useForm({
    defaultValues: {
      questionText: "",
      subjectId: "",
      questionType: "" as "Abcd" | "Writing" | "",
      abcdAnswers: [
        { answer: "", isRight: false },
        { answer: "", isRight: false },
      ],
      answer: "",
    },
    
    onSubmit: async ({ value }) => {
      const submitData = {
        questionText: value.questionText,
        subjectId: value.subjectId,
        questionType: value.questionType as "Abcd" | "Writing",
        abcdAnswers: value.questionType === "Abcd" ? value.abcdAnswers : undefined,
        answer: value.questionType === "Writing" ? value.answer : undefined,
      };
      postMutation.mutate(submitData);
    },
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const postMutation = useMutation({
    mutationFn: postQuestion,
    onSuccess: () => {
        queryClient.invalidateQueries(["questions"]);
        router.push("/question")
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
          name="questionText"
          children={(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Text otázky</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                ></Textarea>
                <FieldDescription>
                  <FieldInfo field={field} />
                </FieldDescription>
              </Field>
            );
          }}
        />

        <form.Field
          name="subjectId"
          children={(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Predmet</FieldLabel>
                <Select
                  disabled={subjectsLoading}
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Vyber predmet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {subjectsData?.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.subjectAbbrev} | {subject.subjectName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  <FieldInfo field={field} />
                </FieldDescription>
              </Field>
            );
          }}
        />

        <form.Field
          name="questionType"
          children={(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Typ otázky</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value as "Abcd" | "Writing")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Vyber typ otázky" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Abcd">ABCD odpoveď</SelectItem>
                      <SelectItem value="Writing">Doplňovacia odpoveď</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  <FieldInfo field={field} />
                </FieldDescription>
              </Field>
            );
          }}
        />

        <form.Subscribe selector={(state) => state.values.questionType}>
          {(questionType) => (
            <>
              {questionType === "Abcd" && (
                <form.Field name="abcdAnswers">
                  {(field) => (
                    <>
                      <FieldLabel>Odpovede</FieldLabel>
                      <div className="space-y-2">
                        {field.state.value.map((_, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <Input
                              placeholder={`Odpoveď ${index + 1}`}
                              value={field.state.value[index].answer}
                              onChange={(e) => {
                                const copy = [...field.state.value];
                                copy[index].answer = e.target.value;
                                field.handleChange(copy);
                              }}
                            />
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={field.state.value[index].isRight}
                              onChange={() => {
                                const copy = field.state.value.map((a, i) => ({
                                  ...a,
                                  isRight: i === index,
                                }));
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
                              { answer: "", isRight: false },
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
                              field.handleChange(field.state.value.slice(0, -1))
                            }
                          >
                            Odstrániť poslednú
                          </Button>
                        )}
                      </div>
                      <FieldDescription>
                        Vyber presne jednu správnu odpoveď
                      </FieldDescription>
                    </>
                  )}
                </form.Field>
              )}

              {questionType === "Writing" && (
                <form.Field
                  name="answer"
                  children={(field) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          Správna odpoveď
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          type="text"
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
              )}
            </>
          )}
        </form.Subscribe>

        <Field>
          <Button type="submit" disabled={postMutation.isPending}>
            Pridať otázku do databázy
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
