import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs, router } from "expo-router";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export default function MahasiswaLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerShadowVisible: false,
        tabBarStyle: {
          borderTopWidth: 0,
          borderRadius: 16,
          elevation: 1,
          shadowOpacity: 4,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "#666666",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="absensiAktif"
        options={{
          title: "Absensi Aktif",
          headerShown: true,
          headerTitle: "ABSENSI AKTIF",
          headerTitleAlign: "center",
          headerLeft: () => (
            <Feather
              name="arrow-left"
              size={24}
              color={theme.colors.primary}
              onPress={() => router.back()}
              style={{ marginLeft: 16 }}
            />
          ),
          tabBarIcon: ({ color }) => (
            <AntDesign name="check-circle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          headerShown: true,
          headerTitle: "PROFIL",
          headerTitleAlign: "center",
          headerLeft: () => (
            <Feather
              name="arrow-left"
              size={24}
              color={theme.colors.primary}
              onPress={() => router.back()}
              style={{ marginLeft: 16 }}
            />
          ),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
