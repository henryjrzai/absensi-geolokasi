import { lightTheme } from "@/lib/theme";
import { Stack } from "expo-router";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const theme = {
    ...DefaultTheme,
    colors: lightTheme.colors,
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />

          {/* Auth */}
          <Stack.Screen name="auth" />

          {/* Groups */}
          <Stack.Screen name="(mahasiswa)" />
          <Stack.Screen name="(dosen)" />
          <Stack.Screen name="(dekan)" />
          <Stack.Screen name="(kaprodi)" />
        </Stack>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
