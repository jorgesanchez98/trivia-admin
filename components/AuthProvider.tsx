"use client";
import { supabase } from "@/lib/supabaseClient";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<{
  session: Session | null;
}>({
  session: null,
});

export default function AuthProvider({ children }: { children: any }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
}
