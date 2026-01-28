"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PageHeadingProps = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeading({
  icon: Icon,
  title,
  subtitle,
  actions,
  className,
}: PageHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b pb-6",
        className
      )}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}

type PageSectionHeadingProps = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  className?: string;
};

export function PageSectionHeading({
  icon: Icon,
  title,
  subtitle,
  className,
}: PageSectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 bg-muted/30 rounded-t-lg border-b px-4 py-4 sm:px-6 sm:py-4",
        className
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <div className="min-w-0">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground mt-0.5 text-sm">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
