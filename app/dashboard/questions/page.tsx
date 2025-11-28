import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

async function deleteQuestion(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;

  const supabase = supabaseServer();
  await supabase.from("questions").delete().eq("id", id);

  revalidatePath("/dashboard/questions");
}

export default async function QuestionsPage() {
  const supabase = supabaseServer();

  const { data: rawQuestions } = await supabase
    .from("questions")
    .select(`
      id,
      text,
      category:categories!questions_category_id_fkey(name)
    `)
    .order("created_at", { ascending: false });

  const questions =
    rawQuestions?.map((q) => ({
      id: q.id,
      text: q.text,
      category: Array.isArray(q.category)
        ? q.category[0] ?? null
        : q.category,
    })) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Questions</h1>

        <Link
          href="/dashboard/questions/new"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          + New Question
        </Link>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-white border rounded-lg shadow p-5 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <div>
              <p className="font-semibold text-gray-800 text-lg">{q.text}</p>
              <p className="text-sm text-gray-500">
                Category: {q.category?.name ?? "Unknown"}
              </p>
            </div>

            <div className="flex gap-4 items-center">
              {/* EDIT → Button */}
              <Link
                href={`/dashboard/questions/${q.id}`}
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Edit
              </Link>

              {/* DELETE → Link */}
              <form action={deleteQuestion}>
                <input type="hidden" name="id" value={q.id} />
                <button
                  type="submit"
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <p className="text-gray-500">No questions yet.</p>
        )}
      </div>
    </div>
  );
}
