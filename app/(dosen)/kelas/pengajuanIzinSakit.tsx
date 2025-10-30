import { getPengajuanIzinSakitBySesi } from "@/lib/models/absensi";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text, useTheme, Dialog } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function PengajuanIzinSakit() {
  const { sesiId } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const theme = useTheme();

  const loadData = async (sesiId: string) => {
    try {
      const result = await getPengajuanIzinSakitBySesi(sesiId.toString());
      console.log(`Fetched pengajuan izin/sakit data: `, result.data);
      setData(result.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData(sesiId.toString());
    setRefreshing(false);
  };

  const handlePreview = (filePath: string | null) => {
    if (filePath) {
      setPreviewImage(filePath);
      setPreviewVisible(true);
    } else {
      setPreviewImage(null);
      setPreviewVisible(true);
    }
  };

  useEffect(() => {
    loadData(sesiId.toString());
  }, [sesiId]);

  if (loading) {
    return (
      <SafeAreaProvider
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Loading...</Text>
      </SafeAreaProvider>
    );
  } else if (error) {
    return (
      <SafeAreaProvider
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Error: {error}</Text>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {data.length === 0 ? (
          <Card style={{ padding: 16, marginBottom: 16 }}>
            <Card.Content>
              <Text style={{ fontStyle: "italic", textAlign: "center" }}>
                Tidak ada pengajuan izin/sakit untuk sesi kuliah ini
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button icon={"arrow-left-bold"} onPress={() => router.back()}>
                Kembali
              </Button>
            </Card.Actions>
          </Card>
        ) : (
          <View>
            {/* Header Info */}
            <Card
              style={[
                styles.headerCard,
                { backgroundColor: theme.colors.tertiary },
              ]}
            >
              <Card.Content>
                <Text variant="headlineSmall" style={styles.title}>
                  Absensi {data.sesi_kuliah.tanggal}
                </Text>
              </Card.Content>
            </Card>

            {/* List of Pengajuan Izin/Sakit */}
            {data.pengajuan.map((item: any) => (
              <Card key={item.id} style={{ marginBottom: 16 }}>
                <Card.Content>
                  <Text variant="titleMedium">
                    {item.mahasiswa.npm} - {item.mahasiswa.nama}
                  </Text>
                  <Text
                    variant="bodyLarge"
                    style={{
                      textTransform: "capitalize",
                    }}
                  >
                    {item.status}{" "}
                    {item.status_validasi === "pending" ? (
                      <Feather name="watch" size={15} color="green" />
                    ) : item.status_validasi === "terima" ? (
                      <FontAwesome
                        name="check-square"
                        size={15}
                        color="green"
                      />
                    ) : (
                      <Feather name="x-square" size={15} color="red" />
                    )}
                  </Text>
                  {item.status_validasi === "pending" && (
                    <Card.Actions>
                      <Button
                        mode="contained"
                        onPress={() => handlePreview(item.bukti_file_path)}
                        buttonColor={theme.colors.onTertiaryContainer}
                      >
                        <AntDesign name="file" size={20} color="white" />
                      </Button>
                      <Button
                        mode="contained"
                        onPress={() => {
                          // Handle accept action
                        }}
                        buttonColor="green"
                      >
                        Terima
                      </Button>
                      <Button
                        mode="contained"
                        onPress={() => {
                          // Handle reject action
                        }}
                        buttonColor={theme.colors.error}
                      >
                        Tolak
                      </Button>
                    </Card.Actions>
                  )}
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      <Dialog
        visible={previewVisible}
        onDismiss={() => setPreviewVisible(false)}
      >
        <Dialog.Title>Bukti Pendukung</Dialog.Title>
        <Dialog.Content>
          {previewImage ? (
            <Image
              source={{ uri: previewImage }}
              style={{ width: 250, height: 350, resizeMode: "contain" }}
            />
          ) : (
            <Text>Tidak ada bukti yang diunggah.</Text>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setPreviewVisible(false)}>Tutup</Button>
        </Dialog.Actions>
      </Dialog>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});
