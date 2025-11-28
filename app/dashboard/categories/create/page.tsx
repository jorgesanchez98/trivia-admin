import { supabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default function CreateCategoryPage() {
  async function createCategory(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;

    const supabase = supabaseServer();
    await supabase.from("categories").insert({ name });

    redirect("/dashboard/categories");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Create Category</h1>

      <form action={createCategory} className="space-y-4 bg-white p-6 border rounded-md">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            required
            className="w-full border rounded-md px-3 py-2"
            placeholder="Category name"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Save
        </button>
      </form>
    </div>
  );
}
