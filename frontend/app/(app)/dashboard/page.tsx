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
import { PageContent } from "@/lib/page-content";
import { PageHeading } from "@/components/ui/page-heading";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  const { userRole, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  const isTeacherOrAdmin = userRole === "Teacher" || userRole === "Admin";
  const isAdmin = userRole === "Admin";

  const allItems = [
    ...navDashboard,
    ...navUser,
    ...(isTeacherOrAdmin ? navTeacher : []),
    ...(isAdmin ? navAdmin : []),
  ];

  return (
    <PageContent>
      <PageHeading
        icon={LayoutDashboard}
        title="Dashboard"
        subtitle="Rýchly prístup k sekciám aplikácie."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allItems.map((item) => (
          <DashboardCard key={item.url} item={item} />
        ))}
      </div>
    </PageContent>
  );
}
