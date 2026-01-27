"use client";

import { Loader2 } from "lucide-react";

type LoadingSpinnerProps = {
  fullscreen?: boolean;
};

export function LoadingSpinner({ fullscreen = true }: LoadingSpinnerProps) {
  const wrapperClasses = fullscreen
    ? "flex h-screen items-center justify-center"
    : "flex items-center justify-center";

  return (
    <div className={wrapperClasses}>
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}

