"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { createQuestion } from "./actions";

type Category = {
  id: string;
  name: string;
};

export default function NewQuestionForm({ categories }: { categories: Category[] }) {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const result = await createQuestion(formData);

    if (result?.error) {
      setError(result.error);
      return;
    }

    redirect("/dashboard/questions");
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-lg">
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {/* QUESTION */}
      <div>
        <label className="block mb-1">Question</label>
        <input
          name="text"
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      {/* CATEGORY */}
      <div>
        <label className="block mb-1">Category</label>
        <select
          name="category_id"
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select category...</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* ANSWERS */}
      <div className="space-y-3">
        <h2 className="font-medium text-lg">Answers</h2>

        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <input
              name={`answer_${i}`}
              placeholder={`Answer ${i + 1}`}
              className="border px-3 py-2 rounded w-full"
            />

            <input
              type="radio"
              name="correct_answer"
              value={String(i)}
              defaultChecked={i === 0}
            />
          </div>
        ))}

        <p className="text-sm text-gray-500">
          * Provide 2–4 answers. One will be marked correct.
        </p>
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
}
