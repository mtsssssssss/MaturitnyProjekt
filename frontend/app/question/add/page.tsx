"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { getSubjects } from "@/api/getSubjects";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";

export default function Page() {
    
  const { data, isLoading, error } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const form = useForm({
      defaultValues: {
        subject: '',
        questionType: '',
      },
      onSubmit: async ({ value }) => {
        // Do something with form data
        console.log(value)
      },
    })

  return (
    <Card>
        <CardContent>

            <form onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}></form>
      <FieldGroup>
        <Field>
          <FieldLabel>Otázka</FieldLabel>
          <Input type="text"></Input>
        </Field>

        <Field>
          <FieldLabel>Predmet</FieldLabel>

          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Vyber predmet" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {data?.map((predmet) => (
                  <SelectItem key={predmet.id} value={predmet.id.toString()}>
                    {predmet.subjectAbbrev} | {predmet.subjectName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <FieldDescription>
            Vyber si predmet z ktorého sa chceš otestovať
          </FieldDescription>
        </Field>
      </FieldGroup>
      </CardContent>
    </Card>
  );
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Prihlásiť sa</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Prihlásovacie meno</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Prihlásovacie meno"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Heslo</FieldLabel>
                  {/*
                  
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                  
                  */}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Heslo"
                  required
                />
              </Field>
              <Field>
                <Button type="submit">Prihlásiť sa</Button>

                {/*<FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>*/}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
