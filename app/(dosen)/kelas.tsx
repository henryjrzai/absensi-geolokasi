import { Text } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function kelas() {
  return (
    <SafeAreaProvider>
      <Text>Kelas Dosen</Text>
    </SafeAreaProvider>
  )
}