import Feather from "@expo/vector-icons/Feather";
import { router, Stack } from "expo-router";
import { useTheme } from "react-native-paper";

export default function KelasStack() {
  const theme = useTheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Kelas",
          headerTitleAlign: "center",
          headerLeft: () => (
            <Feather
              name="arrow-left"
              size={24}
              color={theme.colors.primary}
              onPress={() => router.push("/")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="rekap-absensi"
        options={{
          headerShown: true,
          title: "Rekap Absensi",
          headerTitleAlign: "center",
          headerLeft: () => (
            <Feather
              name="arrow-left"
              size={24}
              color={theme.colors.primary}
              onPress={() => router.push("/kelas")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="detail-absensi"
        options={{
          headerShown: true,
          title: "Detail Absensi",
          headerTitleAlign: "center",
          headerLeft: () => (
            <Feather
              name="arrow-left"
              size={24}
              color={theme.colors.primary}
              onPress={() => router.back()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="pengajuanIzinSakit"
        options={{ headerShown: true, title: "Pengajuan Izin/Sakit" }}
      />
    </Stack>
  );
}
