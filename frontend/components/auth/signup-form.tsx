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
import { FieldGroup } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { TanStackFormInput } from "../custom-form-inputs/form-input";
import { RegisterDto } from "@/types/api/auth";
import { getApiErrorMessage } from "@/lib/api-error";
import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const { register } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: z
        .object({
          username: z
            .string()
            .min(3, "Prihlasovacie meno musí mať minimálne 3 znaky"),
          firstName: z.string().min(1, "Zadaj svoje meno!"),
          lastName: z.string().min(1, "Zadaj svoje priezvisko!"),
          password: z.string().min(6, "Heslo musí mať minimálne 6 znakov"),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Heslá sa nezhodujú",
          path: ["confirmPassword"],
        }),
    },
    onSubmit: async ({ value }) => {
      setAuthError(null);
      const dto: RegisterDto = {
        username: value.username,
        firstName: value.firstName,
        lastName: value.lastName,
        password: value.password,
      };
      try {
        await register(dto);
        router.push("/dashboard");
      } catch (e) {
        setAuthError(getApiErrorMessage(e));
      }
    },
  });

  return (
    <Card
      className={cn("shadow-xl border-t-4 border-t-primary", className)}
      {...props}
    >
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
          <div className="p-3 bg-primary/10 rounded-full">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Vytvoriť účet
        </CardTitle>
        <CardDescription>
          Zaregistrujte sa a získajte prístup k testom
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="space-y-4">
            {authError && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {authError}
              </div>
            )}
            <form.Field
              name="username"
              children={(field) => (
                <TanStackFormInput
                  field={field}
                  label="Prihlasovacie meno"
                  placeholder="napr. matus "
                  className="h-11"
                />
              )}
            />
            <form.Field
              name="firstName"
              children={(field) => (
                <TanStackFormInput
                  field={field}
                  label="Meno"
                  placeholder="napr. Matúš "
                  className="h-11"
                />
              )}
            />
            <form.Field
              name="lastName"
              children={(field) => (
                <TanStackFormInput
                  field={field}
                  label="Priezvisko"
                  placeholder="napr. Čiernik "
                  className="h-11"
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
                  placeholder="••••••••"
                  className="h-11"
                />
              )}
            />
            <form.Field
              name="confirmPassword"
              children={(field) => (
                <TanStackFormInput
                  field={field}
                  type="password"
                  label="Potvrdiť heslo"
                  placeholder="••••••••"
                  className="h-11"
                />
              )}
            />

            <div className="pt-2 space-y-4">
              <Button
                type="submit"
                disabled={form.state.isSubmitting}
                className="w-full h-11 text-base font-semibold"
              >
                {form.state.isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Zaregistrovať sa"
                )}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Už máte účet? </span>
                <Link
                  href="/login"
                  className="text-primary font-semibold hover:underline underline-offset-4"
                >
                  Prihláste sa
                </Link>
              </div>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
