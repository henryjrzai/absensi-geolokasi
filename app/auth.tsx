import { getUserRole, signIn } from "@/lib/auth-context";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";

export default function Auth() {
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const routeByRole = (role: string | null) => {
    switch (role) {
      case "mahasiswa":
        router.replace("/(mahasiswa)");
        break;
      case "dosen":
        router.replace("/(dosen)");
        break;
      case "dekan":
        router.replace("/(dekan)");
        break;
      case "kaprodi":
        router.replace("/(kaprodi)");
        break;
      default:
        setError("Role tidak dikenal");
    }
  };

  // Jika sudah login & buka /auth, langsung lempar ke role
  useEffect(() => {
    (async () => {
      try {
        const role = await getUserRole();
        if (role) routeByRole(role);
      } catch {}
    })();
  }, []);

  const handleLogin = async () => {
    if (!credential || !password) {
      setError("Mohon isi NIDN/NPM dan password");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signIn(credential, password);
      const role = await getUserRole();
      routeByRole(role);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ??
          e?.message ??
          "Login gagal. Periksa NIDN/NPM dan password Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text variant="headlineMedium" style={styles.title}>
          Absensi Fakultas Ilmu Komputer
        </Text>
        <Card>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              Login
            </Text>
            <View>
              {!!error && <Text style={styles.error}>{error}</Text>}
              <TextInput
                style={styles.input}
                label="NIDN/NPM"
                autoCapitalize="none"
                keyboardType="default"
                placeholder="masukkan nidn atau npm anda"
                mode="outlined"
                value={credential}
                onChangeText={setCredential}
              />
              <TextInput
                style={styles.input}
                label="Password"
                secureTextEntry
                mode="outlined"
                autoCapitalize="none"
                keyboardType="default"
                placeholder="**********"
                value={password}
                onChangeText={setPassword}
              />
              <Button
                icon="login"
                mode="contained"
                onPress={handleLogin}
                disabled={loading}
                loading={loading}
              >
                Login
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: "center", padding: 16 },
  title: { marginBottom: 16, textAlign: "center", fontWeight: "bold" },
  input: { marginBottom: 12 },
  logo: { width: 100, height: 100, alignSelf: "center", marginBottom: 24 },
  error: { color: "red", textAlign: "center", marginBottom: 12 },
});
