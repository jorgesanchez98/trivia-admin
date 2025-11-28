// app/api/questions/[id]/route.ts
import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

// ⭐ Next.js 16: params is now a Promise → must await it
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = supabaseServer();

  const { data: question } = await supabase
    .from("questions")
    .select("id, text, category_id")
    .eq("id", id)
    .single();

  if (!question) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: answers } = await supabase
    .from("answers")
    .select("id, text, is_correct")
    .eq("question_id", id)
    .order("id");

  return NextResponse.json({ question, answers });
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = supabaseServer();
  const formData = await req.formData();

  const questionText = formData.get("text") as string;
  const categoryId = formData.get("category_id") as string;

  const answers: {
    answerId: string | null;
    text: string;
    is_correct: boolean;
  }[] = [];

  for (let i = 0; i < 4; i++) {
    const answerId = formData.get(`answer_id_${i}`) as string | null;
    const answerText = formData.get(`answer_${i}`) as string;

    if (answerText?.trim()) {
      answers.push({
        answerId,
        text: answerText.trim(),
        is_correct: formData.get("correct_answer") === String(i),
      });
    }
  }

  if (answers.length < 2) {
    return NextResponse.json(
      { error: "At least 2 answers required" },
      { status: 400 }
    );
  }

  await supabase
    .from("questions")
    .update({ text: questionText, category_id: categoryId })
    .eq("id", id);

  await supabase.from("answers").delete().eq("question_id", id);

  await supabase.from("answers").insert(
    answers.map((a) => ({
      question_id: id,
      text: a.text,
      is_correct: a.is_correct,
    }))
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = supabaseServer();

  await supabase.from("questions").delete().eq("id", id);

  return NextResponse.json({ ok: true });
}
