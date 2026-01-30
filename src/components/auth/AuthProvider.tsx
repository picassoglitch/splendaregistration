"use client";

import React, { createContext, useContext, useEffect, useMemo } from "react";
import {
  clearStoredProfile,
  setStoredProfile,
  type StoredProfile,
} from "@/lib/storage";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useStoredProfile } from "@/lib/hooks/useStorage";

type AuthContextValue = {
  profile: StoredProfile | null;
  setProfile: (p: StoredProfile) => void;
  logout: () => void;
  supabaseEnabled: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const profile = useStoredProfile();
  const supabase = useMemo(() => getSupabaseClient(), []);

  useEffect(() => {
    if (!supabase) return;
    const sync = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (user?.email) {
        const name =
          (user.user_metadata?.full_name as string | undefined) ??
          (user.user_metadata?.name as string | undefined) ??
          user.email.split("@")[0] ??
          "Usuario";
        setStoredProfile({ name, email: user.email });
      } else {
        clearStoredProfile();
      }
    };

    sync().catch(() => undefined);

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      sync().catch(() => undefined);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      profile,
      setProfile: (p) => {
        setStoredProfile(p);
      },
      logout: async () => {
        clearStoredProfile();
        try {
          await supabase?.auth.signOut();
        } catch {
          // ignore
        }
      },
      supabaseEnabled: Boolean(supabase),
    }),
    [profile, supabase],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

