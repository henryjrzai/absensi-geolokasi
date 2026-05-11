import {
  getPengajuanIzinSakitBySesi,
  validatePengajuanIzinSakit,
} from "@/lib/models/absensi";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  Dialog,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function PengajuanIzinSakit() {
  const { sesiId } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [validatingId, setValidatingId] = useState<number | null>(null);
  const theme = useTheme();

  const pengajuanList = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.pengajuan || [];
  }, [data]);

  const loadData = async (currentSesiId: string) => {
    try {
      const result = await getPengajuanIzinSakitBySesi(currentSesiId);
      setData(result?.data ?? []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Gagal memuat pengajuan izin/sakit.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData(String(sesiId));
    setRefreshing(false);
  };

  const handlePreview = (filePath: string | null) => {
    setPreviewImage(filePath || null);
    setPreviewVisible(true);
  };

  const handleValidasi = async (validasi: string, pengajuanId: number) => {
    try {
      setValidatingId(pengajuanId);
      const result = await validatePengajuanIzinSakit(validasi, pengajuanId);
      if (result?.status) {
        await loadData(String(sesiId));
      } else {
        setError(result?.message || "Gagal melakukan validasi.");
      }
    } catch (err: any) {
      setError(err.message || "Gagal melakukan validasi.");
    } finally {
      setValidatingId(null);
    }
  };

  useEffect(() => {
    loadData(String(sesiId));
  }, [sesiId]);

  const getStatusColor = (status?: string) => {
    switch ((status || "").toLowerCase()) {
      case "izin":
        return "#CA8A04";
      case "sakit":
        return "#0284C7";
      default:
        return "#6B7280";
    }
  };

  const getValidationLabel = (status?: string) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "Menunggu";
      case "terima":
      case "diterima":
        return "Diterima";
      case "tolak":
      case "ditolak":
        return "Ditolak";
      default:
        return status || "-";
    }
  };

  const getValidationColor = (status?: string) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "#6B7280";
      case "terima":
      case "diterima":
        return "#16A34A";
      case "tolak":
      case "ditolak":
        return "#DC2626";
      default:
        return "#6B7280";
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <Card
          style={[
            styles.summaryCard,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <Card.Content>
            <Text
              variant="labelLarge"
              style={{ color: theme.colors.onPrimaryContainer, fontWeight: "700" }}
            >
              PENGAJUAN IZIN & SAKIT
            </Text>
            <Text
              variant="headlineSmall"
              style={{
                color: theme.colors.onPrimaryContainer,
                fontWeight: "800",
                marginTop: 6,
              }}
            >
              {pengajuanList.length} Pengajuan
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onPrimaryContainer, marginTop: 8 }}
            >
              Tinjau bukti dan validasi pengajuan mahasiswa pada sesi ini.
            </Text>
          </Card.Content>
        </Card>

        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator size="small" />
            <Text style={styles.stateText}>Memuat data pengajuan...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateCard}>
            <MaterialIcons name="error-outline" size={20} color={theme.colors.error} />
            <Text style={[styles.stateText, { color: theme.colors.error }]}>{error}</Text>
          </View>
        ) : pengajuanList.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>
                Tidak ada pengajuan izin/sakit untuk sesi kuliah ini.
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button icon="arrow-left" onPress={() => router.back()}>
                Kembali
              </Button>
            </Card.Actions>
          </Card>
        ) : (
          pengajuanList.map((item: any) => (
            <Card key={item.id} style={styles.itemCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.studentName}>
                  {item.mahasiswa?.npm} - {item.mahasiswa?.nama}
                </Text>

                <View style={styles.badgeRow}>
                  <Chip
                    style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}
                    textStyle={styles.badgeText}
                  >
                    {(item.status || "-").toUpperCase()}
                  </Chip>
                  <Chip
                    style={[
                      styles.badge,
                      { backgroundColor: getValidationColor(item.status_validasi) },
                    ]}
                    textStyle={styles.badgeText}
                  >
                    {getValidationLabel(item.status_validasi)}
                  </Chip>
                </View>

                {item.keterangan ? (
                  <Text variant="bodySmall" style={styles.noteText}>
                    {item.keterangan}
                  </Text>
                ) : null}

                <View style={styles.actionsRow}>
                  <Button
                    mode="outlined"
                    icon="file-eye"
                    onPress={() => handlePreview(item.bukti_file_path)}
                  >
                    Lihat Bukti
                  </Button>

                  {item.status_validasi === "pending" && (
                    <>
                      <Button
                        mode="contained"
                        buttonColor="#16A34A"
                        onPress={() => handleValidasi("terima", item.id)}
                        loading={validatingId === item.id}
                        disabled={validatingId === item.id}
                      >
                        Terima
                      </Button>
                      <Button
                        mode="contained"
                        buttonColor={theme.colors.error}
                        onPress={() => handleValidasi("tolak", item.id)}
                        loading={validatingId === item.id}
                        disabled={validatingId === item.id}
                      >
                        Tolak
                      </Button>
                    </>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <Portal>
        <Dialog visible={previewVisible} onDismiss={() => setPreviewVisible(false)}>
          <Dialog.Title>Bukti Pendukung</Dialog.Title>
          <Dialog.Content>
            {previewImage ? (
              <Image source={{ uri: previewImage }} style={styles.previewImage} />
            ) : (
              <Text>Tidak ada bukti yang diunggah.</Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPreviewVisible(false)}>Tutup</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    paddingBottom: 20,
  },
  summaryCard: {
    borderRadius: 16,
    marginBottom: 14,
  },
  stateCard: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stateText: {
    fontSize: 14,
    color: "#444",
  },
  emptyCard: {
    borderRadius: 12,
    backgroundColor: "white",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
  },
  itemCard: {
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "white",
  },
  studentName: {
    fontWeight: "700",
  },
  badgeRow: {
    marginTop: 8,
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  badge: {
    height: 30,
  },
  badgeText: {
    color: "white",
    fontWeight: "700",
    fontSize: 11,
  },
  noteText: {
    marginTop: 10,
    color: "#4B5563",
  },
  actionsRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  previewImage: {
    width: 260,
    height: 360,
    resizeMode: "contain",
    alignSelf: "center",
  },
});
