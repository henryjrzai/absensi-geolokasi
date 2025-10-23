import { HeaderDashboard } from "@/components/HeaderDashboard";
import { getUserData, signOut } from "@/lib/auth-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";

export default function MahasiswaIndex() {
  const [userData, setUserData] = useState<any>(null);
  const theme = useTheme();

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
      <HeaderDashboard nama={userData?.nama} id={userData?.npm} />

      {/* Menu */}
      <View style={styles.menu}>
        <Pressable
          style={[styles.menuItem, { backgroundColor: theme.colors.primary }]}
        >
          <Entypo name="book" size={24} color="white" />
          <Text style={styles.menuItemText}>Menu Kuliah</Text>
        </Pressable>
        <Pressable
          style={[styles.menuItem, { backgroundColor: theme.colors.primary }]}
        >
          <AntDesign name="schedule" size={24} color="white" />
          <Text style={styles.menuItemText}>Jadwal Kuliah</Text>
        </Pressable>
      </View>
      {/* End Menu */}

      {/* Courses */}
      <View style={{ marginVertical: 8 }}>
        <Text variant="titleSmall">📚 Matakuliah yang sedang diambil</Text>
        <View>
          {/* List of courses can be rendered here */}
        </View>
      </View>
      {/* End Courses */}

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
  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  menuItem: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  menuItemText: {
    color: "white",
    marginTop: 8,
    fontWeight: "bold",
  },
});
