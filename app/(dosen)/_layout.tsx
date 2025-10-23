import { Stack } from "expo-router";

export default function DosenLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Dashboard Dosen",
        }}
      />
    </Stack>
  );
}
