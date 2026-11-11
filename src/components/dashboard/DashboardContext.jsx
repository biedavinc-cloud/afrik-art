import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { api } from "@/api/client";
import { useAuth } from "@/lib/AuthContext";

const Ctx = createContext(null);

export function DashboardProvider({ children }) {
  const { user, isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    const res = await api.entities.ArtistProfile.filter({ user_id: user.id }, { limit: 1 });
    const items = Array.isArray(res) ? res : res?.items || [];
    setProfile(items[0] || null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (isLoadingAuth) return;
    refresh();
  }, [isLoadingAuth, refresh]);

  useEffect(() => {
    if (!isLoadingAuth && !loading && user && !profile) {
      navigate({ to: "/onboarding" });
    }
  }, [isLoadingAuth, loading, user, profile, navigate]);

  return (
    <Ctx.Provider value={{ user, profile, loading, refresh }}>{children}</Ctx.Provider>
  );
}

export function useDashboard() {
  return useContext(Ctx);
}