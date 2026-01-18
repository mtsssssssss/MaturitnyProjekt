"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { TanStackFormInput } from "../custom-form-inputs/form-input";
import { RegisterDto } from "@/types/api/auth";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const { register } = useAuth();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: z
        .object({
          username: z
            .string()
            .min(3, "Prihlasovacie meno musí mať minimálne 3 znaky"),
          password: z.string().min(6, "Heslo musí mať minimálne 6 znakov"),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Heslá sa nezhodujú",
          path: ["confirmPassword"],
        }),
    },
    onSubmit: async ({ value }: { value: RegisterDto }) => {
      try {
        await register(value);
        router.push("/dashboard");
      } catch (e) {
        console.log("Error");
      }
    },
  });

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Vytvoriť si svoj účet</CardTitle>
        <CardDescription>
          Vyplňte údaje pre vytvorenie nového účtu
        </CardDescription>
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
                  placeholder="Prihlasovacie meno"
                />
              )}
            />
            <form.Field
              name="password"
              children={(field) => (
                <TanStackFormInput
                  field={field}
                  type="password"
                  label="Heslo"
                  placeholder="Heslo"
                />
              )}
            />
            <form.Field
              name="confirmPassword"
              children={(field) => (
                <TanStackFormInput
                  field={field}
                  type="password"
                  label="Potvrď heslo"
                  placeholder="Heslo"
                />
              )}
            />
            <Field>
              <Button type="submit">Vytvoriť si účet</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

