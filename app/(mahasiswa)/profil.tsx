import UpdateFotoProfilModal from "@/components/UpdateFotoProfilModal";
import { getUserData, signOut } from "@/lib/auth-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Divider, Text, useTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Profil() {
  const [userData, setUserData] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useTheme();

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
    setUserData({ ...userData, foto: newFotoUrl });
  };

  const getInitials = () => {
    const name = (userData?.nama || "").trim();
    if (!name) return "MH";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Card
          style={[
            styles.heroCard,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <Card.Content>
            <View style={styles.heroTop}>
              <Pressable onPress={() => setModalVisible(true)} style={styles.avatarButton}>
                {userData?.foto ? (
                  <Avatar.Image size={90} source={{ uri: userData.foto }} />
                ) : (
                  <Avatar.Text
                    size={80}
                    label={getInitials()}
                    style={{ backgroundColor: theme.colors.secondaryContainer }}
                    color={theme.colors.onSecondaryContainer}
                  />
                )}
                <View
                  style={[
                    styles.editIconContainer,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <MaterialIcons name="photo-camera" size={18} color={theme.colors.onPrimary} />
                </View>
              </Pressable>

              <View style={styles.heroText}>
                <Text
                  variant="titleLarge"
                  numberOfLines={1}
                  style={[styles.nameText, { color: theme.colors.onPrimaryContainer }]}
                >
                  {userData?.nama || "Nama Mahasiswa"}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onPrimaryContainer, opacity: 0.9 }}
                >
                  NPM: {userData?.npm || "-"}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.detailCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Informasi Akun
            </Text>
            <Divider style={styles.divider} />

            <View style={styles.rowData}>
              <MaterialIcons name="badge" size={20} color={theme.colors.primary} />
              <View style={styles.rowText}>
                <Text variant="bodySmall" style={styles.labelText}>
                  NPM
                </Text>
                <Text variant="bodyLarge" style={styles.valueText}>
                  {userData?.npm || "-"}
                </Text>
              </View>
            </View>

            <View style={styles.rowData}>
              <MaterialIcons name="person-outline" size={20} color={theme.colors.primary} />
              <View style={styles.rowText}>
                <Text variant="bodySmall" style={styles.labelText}>
                  Nama Lengkap
                </Text>
                <Text variant="bodyLarge" style={styles.valueText}>
                  {userData?.nama || "-"}
                </Text>
              </View>
            </View>

            <View style={styles.rowData}>
              <MaterialIcons name="verified-user" size={20} color={theme.colors.primary} />
              <View style={styles.rowText}>
                <Text variant="bodySmall" style={styles.labelText}>
                  Status
                </Text>
                <Text variant="bodyLarge" style={styles.valueText}>
                  Mahasiswa Aktif
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.actionCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Tindakan
            </Text>
            <Button
              mode="outlined"
              icon="camera"
              style={styles.actionBtn}
              onPress={() => setModalVisible(true)}
            >
              Ubah Foto Profil
            </Button>
            <Button
              mode="contained"
              buttonColor={theme.colors.error}
              textColor={theme.colors.onError}
              icon="logout"
              style={styles.actionBtn}
              onPress={handleLogout}
            >
              Logout
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

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
    backgroundColor: "#F6F8FC",
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    gap: 14,
  },
  heroCard: {
    borderRadius: 18,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatarButton: {
    position: "relative",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  heroText: {
    flex: 1,
  },
  nameText: {
    fontWeight: "800",
  },
  roleBadge: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  detailCard: {
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontWeight: "700",
  },
  divider: {
    marginTop: 8,
    marginBottom: 10,
  },
  rowData: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  rowText: {
    flex: 1,
  },
  labelText: {
    color: "#666",
  },
  valueText: {
    fontWeight: "600",
  },
  actionCard: {
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  actionBtn: {
    marginTop: 12,
    borderRadius: 10,
  },
});
