// app/dashboard/layout.tsx
"use client";

import { useTransition } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(() => {
      fetch("/login/actions", {
        method: "POST",
        body: JSON.stringify({ action: "logout" }),
      }).then(() => {
        window.location.href = "/login";
      });
    });
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>

          <nav className="space-y-2">
            <a
              href="/dashboard/categories"
              className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition"
            >
              📂 Categories
            </a>
            <a
              href="/dashboard/questions"
              className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition"
            >
              ❓ Questions
            </a>
            <a
              href="/dashboard"
              className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition"
            >
              🖥️ Dashboard
            </a>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
