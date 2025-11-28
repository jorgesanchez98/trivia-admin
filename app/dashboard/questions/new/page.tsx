import { supabaseServer } from "@/lib/supabaseServer";
import NewQuestionForm from "./NewQuestionForm";

export default async function NewQuestionPage() {
  const supabase = supabaseServer();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return (
    <div>
      <h1 className="text-2xl mb-4">New Question</h1>
      <NewQuestionForm categories={categories || []} />
    </div>
  );
}
