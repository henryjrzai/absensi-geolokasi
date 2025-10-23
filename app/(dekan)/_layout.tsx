import { Stack } from "expo-router";

export default function DekanLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Dashboard Dekan",
        }}
      />
    </Stack>
  );
}
