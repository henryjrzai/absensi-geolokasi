import { Stack } from "expo-router";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const color = {
    "colors": {
      "primary": "rgb(145, 76, 0)",
      "onPrimary": "rgb(255, 255, 255)",
      "primaryContainer": "rgb(255, 220, 195)",
      "onPrimaryContainer": "rgb(47, 21, 0)",
      "secondary": "rgb(115, 92, 0)",
      "onSecondary": "rgb(255, 255, 255)",
      "secondaryContainer": "rgb(255, 224, 135)",
      "onSecondaryContainer": "rgb(35, 26, 0)",
      "tertiary": "rgb(11, 97, 164)",
      "onTertiary": "rgb(255, 255, 255)",
      "tertiaryContainer": "rgb(210, 228, 255)",
      "onTertiaryContainer": "rgb(0, 28, 55)",
      "error": "rgb(186, 26, 26)",
      "onError": "rgb(255, 255, 255)",
      "errorContainer": "rgb(255, 218, 214)",
      "onErrorContainer": "rgb(65, 0, 2)",
      "background": "rgb(255, 251, 255)",
      "onBackground": "rgb(32, 26, 23)",
      "surface": "rgb(255, 251, 255)",
      "onSurface": "rgb(32, 26, 23)",
      "surfaceVariant": "rgb(243, 223, 210)",
      "onSurfaceVariant": "rgb(81, 68, 59)",
      "outline": "rgb(132, 116, 105)",
      "outlineVariant": "rgb(214, 195, 183)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(53, 47, 43)",
      "inverseOnSurface": "rgb(250, 238, 232)",
      "inversePrimary": "rgb(255, 183, 126)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(250, 242, 242)",
        "level2": "rgb(246, 237, 235)",
        "level3": "rgb(243, 232, 227)",
        "level4": "rgb(242, 230, 224)",
        "level5": "rgb(240, 227, 219)"
      },
      "surfaceDisabled": "rgba(32, 26, 23, 0.12)",
      "onSurfaceDisabled": "rgba(32, 26, 23, 0.38)",
      "backdrop": "rgba(58, 46, 38, 0.4)"
    }
  }

  const theme = {
    ...DefaultTheme,
    colors: color.colors
    // colors: yourGeneratedLightOrDarkScheme.colors, // Copy it from the color codes scheme and then use it here
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
