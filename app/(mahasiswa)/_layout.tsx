import { Stack } from "expo-router";

export default function MahasiswaLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Dashboard Mahasiswa",
        }}
      />
    </Stack>
  );
}
