import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import { getUserData } from "@/lib/auth-context";

export default function DosenLayout() {
  const theme = useTheme();
  const [isKaprodi, setIsKaprodi] = useState(false);

  useEffect(() => {
    (async () => {
      const userData = await getUserData();
      setIsKaprodi(!!userData?.is_kaprodi);
    })();
  }, []);

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
          headerShown: false,
          // headerTitleAlign: "center",
          // headerLeft: () => (
          //   <Feather
          //     name="arrow-left"
          //     size={24}
          //     color={theme.colors.primary}
          //     onPress={() => router.back()}
          //     style={{ marginLeft: 16 }}
          //   />
          // ),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="class" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="kaprodi"
        options={{
          title: "Kaprodi",
          headerShown: false,
          href: isKaprodi ? undefined : null,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="admin-panel-settings" size={24} color={color} />
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
    </Tabs>
  );
}
