import { Stack } from "expo-router";

export default function KaprodiTabLayout() {
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
