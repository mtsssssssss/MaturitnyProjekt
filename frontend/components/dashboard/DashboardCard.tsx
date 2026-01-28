"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import type { NavItem } from "@/lib/nav-config";

type DashboardCardProps = { item: NavItem };

export function DashboardCard({ item }: DashboardCardProps) {
  const Icon = item.icon;
  return (
    <Link href={item.url} className="block outline-none group">
      <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {item.title}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
