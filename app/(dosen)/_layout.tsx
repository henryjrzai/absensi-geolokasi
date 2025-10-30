import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Tabs } from "expo-router";
import { useTheme } from "react-native-paper";

export default function DosenLayout() {
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
        name="kelas"
        options={{
          title: "Kelas",
          headerShown: true,
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
            <MaterialIcons name="class" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil Dosen",
          headerShown: true,
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
      <Tabs.Screen
        name="rekap-absensi"
        options={{
          headerShown: true,
          headerTitle: "REKAP ABSENSI MATAKULIAH",
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
          href: null,
        }}
      />
      <Tabs.Screen
        name="detail-absensi"
        options={{
          headerShown: true,
          headerTitle: "DETAIL ABSENSI",
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
          href: null,
        }}
      />
      <Tabs.Screen
        name="pengajuanIzinSakit"
        options={{
          headerShown: true,
          headerTitle: "PENGAJUAN IZIN/SAKIT",
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
          href: null,
        }}
      />
    </Tabs>
  );
}
