import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { checkAuthAndRole } from "@/lib/auth-context";
import AppSplash from "@/components/AppSplash";

export default function IndexGate() {
  const [loading, setLoading] = useState(true);
  const MIN_SPLASH_DURATION_MS = 2500;
  const [state, setState] = useState<{ isAuthenticated: boolean; role: string | null }>({
    isAuthenticated: false,
    role: null,
  });

  useEffect(() => {
    (async () => {
      const startedAt = Date.now();
      try {
        const res = await checkAuthAndRole();
        setState(res);
      } finally {
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, MIN_SPLASH_DURATION_MS - elapsed);
        if (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, remaining));
        }
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <AppSplash />;
  }

  if (!state.isAuthenticated) return <Redirect href="/auth" />;

  switch (state.role) {
    case "mahasiswa":
      return <Redirect href="/(mahasiswa)" />;
    case "dosen":
      return <Redirect href="/(dosen)" />;
    case "dekan":
      return <Redirect href="/(dekan)" />;
    case "kaprodi":
      return <Redirect href="/(kaprodi)" />;
    default:
      return <Redirect href="/auth" />;
  }
}
