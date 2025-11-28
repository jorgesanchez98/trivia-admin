"use client";

import { useState } from "react";

type Question = {
  id: string;
  text: string;
  category_id: string;
};

type Answer = {
  id: string;
  text: string;
  is_correct: boolean;
};

type Category = {
  id: string;
  name: string;
};

type Props = {
  question: Question;
  categories: Category[];
  answers: Answer[];
};

export default function EditQuestionPageClient({ question, categories, answers }: Props) {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);

    const res = await fetch(`/api/questions/${question.id}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Update failed");
      return;
    }

    window.location.href = "/dashboard/questions";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">

      <div>
        <label>Text</label>
        <input
          name="text"
          defaultValue={question.text}
          className="border rounded w-full p-2"
          required
        />
      </div>

      <div>
        <label>Category</label>
        <select
          name="category_id"
          defaultValue={question.category_id}
          className="border rounded w-full p-2"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <h2>Answers</h2>

        {[0, 1, 2, 3].map((i) => {
          const a = answers[i];
          return (
            <div key={i} className="flex gap-2 items-center">
              <input type="hidden" name={`answer_id_${i}`} value={a?.id || ""} />

              <input
                name={`answer_${i}`}
                defaultValue={a?.text || ""}
                placeholder={`Answer ${i + 1}`}
                className="border p-2 rounded flex-1"
              />

              <input
                type="radio"
                name="correct_answer"
                value={String(i)}
                defaultChecked={a?.is_correct}
              />
            </div>
          );
        })}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
}
