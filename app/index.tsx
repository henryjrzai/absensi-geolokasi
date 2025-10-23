import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { checkAuthAndRole } from "@/lib/auth-context";

export default function IndexGate() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<{ isAuthenticated: boolean; role: string | null }>({
    isAuthenticated: false,
    role: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await checkAuthAndRole();
        setState(res);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
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
