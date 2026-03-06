"use client";

import ProtectedLayout from "../components/ProtectedLayout";
import Dashboard from "../pages/Dashboard";

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <Dashboard ministry={"youth"} />
    </ProtectedLayout>
  );
}