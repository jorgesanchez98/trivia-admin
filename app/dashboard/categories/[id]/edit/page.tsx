import { supabaseServer } from "@/lib/supabaseServer";
import { redirect, notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = supabaseServer();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (!category) return notFound();

  async function updateCategory(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;

    const supabase = supabaseServer();
    await supabase.from("categories").update({ name }).eq("id", id);

    redirect("/dashboard/categories");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Edit Category</h1>

      <form action={updateCategory} className="space-y-4 bg-white p-6 border rounded-md">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            defaultValue={category.name}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Update
        </button>
      </form>
    </div>
  );
}
