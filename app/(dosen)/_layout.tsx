import { Stack } from "expo-router";

export default function DosenLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Dashboard Dosen",
        }}
      />
    </Stack>
  );
}
