import { router } from "expo-router";
import { getUserData, signOut } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, Text, Button } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Profil() {
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
    <SafeAreaProvider style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={150}
          source={require("../../assets/images/logo.png")}
        />
      </View>
      <Card>
        <Card.Content>
          <View style={styles.user}>
            <View style={styles.rowData}>
              <Text style={{ flex: 0, minWidth: 80 }}>Nama</Text>
              <Text style={{ marginHorizontal: 10 }}>:</Text>
              <Text style={{ flex: 1 }}>{userData?.nama}</Text>
            </View>
            <View style={styles.rowData}>
              <Text style={{ flex: 0, minWidth: 80 }}>NPM</Text>
              <Text style={{ marginHorizontal: 10 }}>:</Text>
              <Text style={{ flex: 1 }}>{userData?.npm}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        icon="logout"
      >
        Logout
      </Button>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  user: { marginBottom: 10 },
  rowData: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  statistikContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  logoutButton: {
    marginTop: 16,
  },
});
