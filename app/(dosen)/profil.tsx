import UpdateFotoProfilModal from "@/components/UpdateFotoProfilModal";
import { getUserData, signOut } from "@/lib/auth-context";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Profil() {
  const [userData, setUserData] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const data = await getUserData();
      setUserData(data);
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.replace("/auth");
  };

  const handleUpdateFotoSuccess = (newFotoUrl: string) => {
    // Update userData with new photo URL
    setUserData({ ...userData, foto: newFotoUrl });
  };

  const getAvatarSource = () => {
    if (userData?.foto) {
      return { uri: userData.foto };
    }
    return require("../../assets/images/logo.png");
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Avatar.Image size={150} source={getAvatarSource()} />
          <View style={styles.editIconContainer}>
            <Avatar.Icon size={40} icon="camera" style={styles.editIcon} />
          </View>
        </TouchableOpacity>
      </View>
      <Card>
        <Card.Content>
          <View style={styles.user}>
            <View style={styles.rowData}>
              <Text style={{ flex: 0, minWidth: 80 }}>Nama</Text>
              <Text style={{ marginHorizontal: 10 }}>:</Text>
              <Text style={{ flex: 1 }}>{userData?.nama}</Text>
            </View>
            <View style={styles.rowData}>
              <Text style={{ flex: 0, minWidth: 80 }}>NIDN</Text>
              <Text style={{ marginHorizontal: 10 }}>:</Text>
              <Text style={{ flex: 1 }}>{userData?.nidn}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        icon="logout"
      >
        Logout
      </Button>

      <UpdateFotoProfilModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onSuccess={handleUpdateFotoSuccess}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 20,
  },
  editIcon: {
    backgroundColor: "#914c00",
  },
  user: { marginBottom: 10 },
  rowData: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  statistikContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  logoutButton: {
    marginTop: 16,
  },
});
