import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import {useState} from "react";

export default function Index() {

  const [credential, setCredential] = useState<string>();
  const [password, setPassword] = useState<string>();

  const handleLogin = () => {}

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text variant="headlineMedium" style={styles.title}>
          Absensi Fakultas Ilmu Komputer
        </Text>
        <Card>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              Login
            </Text>
            <View>
              <TextInput
                style={styles.input}
                label="NIDN/NPM"
                autoCapitalize="none"
                keyboardType="default"
                placeholder="masukkan nidn atau npm anda"
                mode="outlined"
                onChangeText={setCredential}
              />
              <TextInput
                style={styles.input}
                label="Password"
                secureTextEntry={true}
                mode="outlined"
                autoCapitalize="none"
                keyboardType="default"
                placeholder="**********"
                onChangeText={setPassword}
              />
              <Button icon="login" mode="contained" onPress={handleLogin}>
                Login
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    marginBottom: 12,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 24,
  },
});
