"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  navDashboard,
  navUser,
  navTeacher,
  navAdmin,
} from "@/lib/nav-config";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DashboardPage() {
  const { userRole, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <p className="text-muted-foreground">Pre zobrazenie dashboardu sa prihláste.</p>
      </div>
    );
  }

  const isTeacherOrAdmin = userRole === "Teacher" || userRole === "Admin";
  const isAdmin = userRole === "Admin";

  const allItems = [
    ...navDashboard,
    ...navUser,
    ...(isTeacherOrAdmin ? navTeacher : []),
    ...(isAdmin ? navAdmin : []),
  ];

  return (
    <main className="py-6 md:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Rýchly prístup k sekciám aplikácie
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allItems.map((item) => (
            <DashboardCard key={item.url} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
