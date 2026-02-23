"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session on mount
    const getSession = async () => {
      try {
        const client = getSupabaseClient();
        const { data } = await client.auth.getSession();
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    try {
      const client = getSupabaseClient();
      const { data: listener } = client.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null);
        },
      );

      return () => {
        listener.subscription.unsubscribe();
      };
    } catch (error) {
      console.error("Error setting up auth listener:", error);
    }
  }, []);

  const logout = async () => {
    try {
      const client = getSupabaseClient();
      await client.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
