"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginForm() {
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input name="email" placeholder="Email" type="email" required />
      <br />
      <input name="password" placeholder="Password" type="password" required />
      <br />
      <button type="submit">Login</button>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
    </form>
  );
}
