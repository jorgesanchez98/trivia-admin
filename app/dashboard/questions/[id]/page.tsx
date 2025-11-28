// app/dashboard/questions/[id]/page.tsx
import { supabaseServer } from "@/lib/supabaseServer";
import EditQuestionPageClient from "./EditQuestionPageClient";

export default async function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = supabaseServer();

  // Fetch question
  const { data: question } = await supabase
    .from("questions")
    .select("id, text, category_id")
    .eq("id", id)
    .single();

  if (!question) return <p>Question not found</p>;

  // Fetch answers
  const { data: answers } = await supabase
    .from("answers")
    .select("id, text, is_correct")
    .eq("question_id", id)
    .order("id");

  // Fetch categories for dropdown
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return (
    <EditQuestionPageClient
      question={question}
      answers={answers || []}
      categories={categories || []}
    />
  );
}
