"use client";

import { useState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);

    const result = await loginAction(formData);

    if (result?.error) {
      setErrorMsg(result.error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 p-6 border rounded w-80"
      >
        <h1 className="text-xl font-bold">Admin Login</h1>

        <input name="email" placeholder="Email" className="border p-2" />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2"
        />

        {errorMsg && (
          <p className="text-red-500 text-sm">{errorMsg}</p>
        )}

        <button type="submit" className="bg-black text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
