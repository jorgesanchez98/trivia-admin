export const dynamic = "force-dynamic";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export default async function CategoriesPage() {
  const supabase = supabaseServer();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  async function deleteCategory(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;

    const supabase = supabaseServer();
    await supabase.from("categories").delete().eq("id", id);

    revalidatePath("/dashboard/categories");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Categories</h1>

        <Link
          href="/dashboard/categories/create"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          + New Category
        </Link>
      </div>

      <div className="bg-white border rounded-lg shadow p-5">
        {categories?.length === 0 && (
          <p className="text-gray-500">No categories yet.</p>
        )}

        <ul className="divide-y">
          {categories?.map((cat) => (
            <li
              key={cat.id}
              className="py-4 flex items-center justify-between hover:bg-gray-50 px-3 transition"
            >
              <span className="text-lg text-gray-800">{cat.name}</span>

              <div className="flex gap-4 items-center">
                {/* EDIT → Button */}
                <Link
                  href={`/dashboard/categories/${cat.id}/edit`}
                  className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  Edit
                </Link>

                {/* DELETE → Link */}
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={cat.id} />
                  <button
                    type="submit"
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
