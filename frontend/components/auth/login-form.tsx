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
import { Login } from "@/types/api/auth";
import { TanStackFormInput } from "@/components/custom-form-inputs/form-input";
import { getApiErrorMessage } from "@/lib/api-error";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { login } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

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
    onSubmit: async ({ value }: { value: Login }) => {
      setAuthError(null);
      try {
        await login(value);
        router.push("/dashboard");
      } catch (e) {
        setAuthError(getApiErrorMessage(e));
      }
    },
  });

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-md mx-auto", className)}
      {...props}
    >
      <Card className="shadow-xl border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Prihlásiť sa
          </CardTitle>
          <CardDescription>
            Zadajte svoje údaje pre prístup do systému
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
                    type="text"
                    placeholder="napr. matus"
                    className="h-11"
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
                    placeholder="••••••••"
                    className="h-11"
                  />
                )}
              />
              <div className="pt-2 space-y-4">
                <Button
                  type="submit"
                  disabled={form.state.isSubmitting}
                  className="w-full h-11 text-base font-semibold transition-all hover:opacity-90"
                >
                  {form.state.isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Prihlásiť sa"
                  )}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Nemáte účet? </span>
                  <Link
                    href="/signup" 
                    className="text-primary font-semibold hover:underline underline-offset-4"
                  >
                    Vytvorte si ho tu!
                  </Link>
                </div>
              </div>
            </FieldGroup> 
          </form>
        </CardContent>
      </Card>

      <p className="px-8 text-center text-sm text-muted-foreground">
        Máte problém s prihlásením? Kontaktujte správcu systému.
      </p>
    </div>
  );
}