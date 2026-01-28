import { cn } from "./utils";

export function PageContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("py-6 md:py-10 space-y-6 max-w-6xl w-[95%] mx-auto px-2 sm:px-4", className)}>{children}</div>
  );
}
