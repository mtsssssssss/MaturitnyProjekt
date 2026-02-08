import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import { Ghost } from "lucide-react";

export const metadata: Metadata = {
  title: "Online testovací modul pre maturantov",
  description: "Moderný systém pre testovanie maturantov",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">

      <div className="absolute inset-0 bg-background/80 dark:bg-background/90" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/70 to-background/80" />

      <div className="w-full max-w-4xl space-y-8 relative z-10 text-center">
        <header className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Online testovací modul
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-muted-foreground">
            pre maturantov
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6">
            Moderný systém pre testovanie a hodnotenie vedomostí maturantov.
            Jednoduché, rýchle a spoľahlivé riešenie pre vaše skúšky.
          </p>
        </header>

        <Button asChild size="lg" className="min-w-[200px]">
          <Link href="/dashboard">Otestovať sa!</Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          {[
            [
              "Jednoduché použitie",
              "Intuitívne rozhranie pre všetkých používateľov",
            ],
            ["Okamžité výsledky", "Rýchle vyhodnotenie a spätná väzba"],
            ["Bezpečné", "Vaše údaje sú v bezpečí"],
          ].map(([title, desc]) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
