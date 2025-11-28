"use server";

import { supabaseServer } from "@/lib/supabaseServer";

export async function createQuestion(formData: FormData) {
  const text = formData.get("text") as string;
  const category_id = formData.get("category_id") as string;

  // Collect answers
  const answers = [];
  for (let i = 0; i < 4; i++) {
    const answerText = formData.get(`answer_${i}`) as string;
    if (answerText && answerText.trim() !== "") {
      answers.push({
        text: answerText.trim(),
        is_correct: formData.get("correct_answer") === String(i),
      });
    }
  }

  // Validation — friendly
  if (answers.length < 2) {
    return { error: "You must provide at least 2 answers." };
  }

  if (!answers.some((a) => a.is_correct)) {
    answers[0].is_correct = true;
  }

  const supabase = supabaseServer();

  // Create question
  const { data: question, error: qErr } = await supabase
    .from("questions")
    .insert({ text, category_id })
    .select("id")
    .single();

  if (qErr) {
    return { error: qErr.message };
  }

  await supabase.from("answers").insert(
    answers.map((a) => ({
      question_id: question.id,
      text: a.text,
      is_correct: a.is_correct,
    }))
  );

  return { success: true };
}
