"use client";

import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { getSubjects } from "@/api/subjects";
import { createRandomTest } from "@/api/tests";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { TanStackFormInput } from "@/components/custom-form-inputs/form-input";
import { TanStackFormSelect } from "@/components/custom-form-inputs/form-select";
import { PageContent } from "@/lib/page-content";
import { PageHeading, PageSectionHeading } from "@/components/ui/page-heading";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TestCreate } from "@/types/api/tests";
import { Edit3 } from "lucide-react";

export default function TestYourselfPage() {
  const router = useRouter();

  const { data: subjects, isLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const subjectOptions =
    subjects?.map((s) => ({
      key: s.id,
      value: s.id,
      text: `${s.subjectAbbrev} | ${s.subjectName}`,
    })) ?? [];

  const mutation = useMutation({
    mutationFn: (data: TestCreate) => createRandomTest(data),
    onSuccess: (response: { id: string }) => {
      router.push(`/tests/${response.id}`);
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
        subjectId: z.string().min(1, "Vyber predmet."),
      }),
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <PageContent className="max-w-2xl">
      <PageHeading
        icon={Edit3}
        title="Otestovať sa"
        subtitle="Vytvor si náhodný test z vybraného predmetu a otestuj sa."
      />

      <Card className="overflow-hidden">
        <PageSectionHeading
          icon={Edit3}
          title="Vytvoriť test"
          subtitle="Vyber predmet a čas na vypracovanie. Test bude obsahovať náhodne vybrané otázky."
        />
        <div className="p-4 sm:p-6 flex justify-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="max-w-md w-full"
          >
            <FieldGroup className="space-y-4">
              <form.Field
                name="subjectId"
                children={(field) => (
                  <TanStackFormSelect
                    field={field}
                    label="Predmet"
                    options={subjectOptions}
                    placeholder={
                      subjectOptions.length
                        ? "Vyber predmet"
                        : "Žiadne predmety"
                    }
                    description="Predmet, z ktorého sa bude generovať test."
                  />
                )}
              />
              <form.Field
                name="time"
                children={(field) => (
                  <TanStackFormInput
                    field={field}
                    type="number"
                    label="Čas na vypracovanie (min)"
                    placeholder="30"
                  />
                )}
              />
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto min-w-[160px]"
                >
                  {mutation.isPending ? "Vytváram…" : "Otestovať sa"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      </Card>
    </PageContent>
  );
}
