"use client";

import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
} from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { LoginDto } from "@/types/api/auth";
import { TanStackFormInput } from "@/components/custom-form-inputs/form-input";

export const metadata: Metadata = {
  title: "Prihlásiť sa",
};


export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        username: z
          .string()
          .min(3, "Prihlasovacie meno musí mať minimálne 3 znaky"),
        password: z.string().min(6, "Heslo musí mať minimálne 6 znakov"),
      }),
    },
    onSubmit: async ({ value }: { value: LoginDto }) => {
      try {
        await login(value);
        router.push("/dashboard");
      } catch (e) {
        console.log("Error");
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Prihlásiť sa</CardTitle>
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
                name="username"
                children={(field) => (
                  <TanStackFormInput
                    field={field}
                    label="Prihlasovacie meno"
                    type="text"
                    placeholder="Prihlasovacie meno"
                  />
                )}
              />
              <form.Field
                name="password"
                children={(field) => (
                  <TanStackFormInput
                    field={field}
                    label="Heslo"
                    type="password"
                    placeholder="Heslo"
                  />
                )}
              />
              <Field>
                <Button type="submit">Prihlásiť sa</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
