import { getUserData, signOut } from "@/lib/auth-context";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

export default function MahasiswaIndex() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const data = await getUserData();
      setUserData(data);
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.replace("/auth");
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            Dashboard Mahasiswa
          </Text>

          {userData && (
            <View style={styles.userInfo}>
              <Text variant="titleMedium">Nama: {userData.nama}</Text>
              <Text variant="bodyMedium">NPM: {userData.npm}</Text>
              <Text variant="bodyMedium">Role: {userData.role}</Text>
              <Text variant="bodyMedium">ID: {userData.id}</Text>
            </View>
          )}

          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutButton}
            icon="logout"
          >
            Logout
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  card: {
    padding: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "bold",
  },
  userInfo: {
    marginBottom: 24,
    gap: 8,
  },
  logoutButton: {
    marginTop: 16,
  },
});
