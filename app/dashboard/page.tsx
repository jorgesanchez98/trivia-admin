import { supabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default function DashboardHome() {
  // Server Action for logout
  async function logout() {
    "use server";

    const supabase = supabaseServer();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Welcome to the Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Use the menu on the left to manage categories, questions, and answers.
        </p>
      </div>

      <form action={logout}>
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
