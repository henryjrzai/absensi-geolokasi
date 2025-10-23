import { Stack } from "expo-router";

export default function KaprodiLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Dashboard Kaprodi",
        }}
      />
    </Stack>
  );
}
