import {
  bukaSesiAbsensi,
  getSesiAbsensiByJadwalKelas,
} from "@/lib/models/absensi";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { API_URL } from "@/lib/apiConfig";
import {
  ActivityIndicator,
  AnimatedFAB,
  Button,
  Card,
  Dialog,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Location from "expo-location";

export default function RekapAbsensi() {
  const router = useRouter();
  const { jadwalId } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [rekapData, setRekapData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isExtended, setIsExtended] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [locationDialogVisible, setLocationDialogVisible] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const theme = useTheme();

  const toggleDialog = () => setVisible((v) => !v);
  const toggleLocationDialog = () => setLocationDialogVisible((v) => !v);

  const onScroll = ({ nativeEvent }: any) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  const loadRekapAbsensi = async (currentJadwalId: number) => {
    try {
      setLoading(true);
      const result = await getSesiAbsensiByJadwalKelas(currentJadwalId);
      if (result.status) {
        setRekapData(result);
        setError(null);
      } else {
        setError(result.message || "Gagal memuat rekap absensi.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jadwalId) {
      loadRekapAbsensi(Number(jadwalId));
    }
  }, [jadwalId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRekapAbsensi(Number(jadwalId));
    setRefreshing(false);
  };

  const handleOpenSession = () => {
    toggleDialog();
    toggleLocationDialog();
  };

  const createSession = async (
    location?: { latitude: number; longitude: number } | undefined
  ) => {
    setLoading(true);
    toggleLocationDialog();
    try {
      const result = await bukaSesiAbsensi(Number(jadwalId), location);
      if (result?.status) {
        await loadRekapAbsensi(Number(jadwalId));
        Alert.alert("Sukses", "Sesi absensi berhasil dibuka.");
      } else {
        setError(result?.message || "Gagal membuka sesi absensi.");
        Alert.alert("Error", result?.message || "Gagal membuka sesi absensi.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
      Alert.alert("Error", err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSessionWithLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Izin Lokasi Ditolak",
        "Aplikasi memerlukan izin lokasi untuk melanjutkan."
      );
      toggleLocationDialog();
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      await createSession({ latitude, longitude });
    } catch {
      Alert.alert("Error Lokasi", "Gagal mendapatkan lokasi. Pastikan GPS aktif.");
      toggleLocationDialog();
    }
  };

  const handleDownloadPDF = async () => {
    const kelasId = rekapData?.data?.kelas_id;
    if (!kelasId || !jadwalId) {
      Alert.alert("Error", "ID Kelas atau ID Jadwal tidak ditemukan.");
      return;
    }

    try {
      setDownloading(true);
      const token = await AsyncStorage.getItem("token");
      
      const downloadUrl = `${API_URL}/kelas/${kelasId}/jadwal/${jadwalId}/absensi-pdf`;
      const filename = `Laporan_Absensi_Kelas_${kelasId}_Jadwal_${jadwalId}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      const response = await FileSystem.downloadAsync(downloadUrl, fileUri, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (response.status === 200) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "application/pdf",
            dialogTitle: "Unduh Laporan Absensi",
            UTI: "com.adobe.pdf",
          });
        } else {
          Alert.alert("Sukses", `File berhasil diunduh ke: ${fileUri}`);
        }
      } else {
        Alert.alert("Gagal", "Gagal mengunduh file laporan absensi.");
      }
    } catch (err: any) {
      console.error("Download error:", err);
      Alert.alert("Error", err.message || "Terjadi kesalahan saat mengunduh laporan.");
    } finally {
      setDownloading(false);
    }
  };

  const sesiList = rekapData?.sesi_kuliah || [];

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content>
            <Text
              variant="labelLarge"
              style={{ color: theme.colors.onPrimaryContainer, fontWeight: "700" }}
            >
              REKAP ABSENSI KELAS
            </Text>
            <Text
              variant="headlineSmall"
              style={{
                color: theme.colors.onPrimaryContainer,
                fontWeight: "800",
                marginTop: 6,
              }}
            >
              {sesiList.length} Sesi Tercatat
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onPrimaryContainer, marginTop: 8 }}
            >
              Pilih sesi untuk melihat detail absensi mahasiswa.
            </Text>
            <Button
              icon="file-pdf-box"
              mode="contained"
              onPress={handleDownloadPDF}
              loading={downloading}
              disabled={downloading || !rekapData}
              style={{
                marginTop: 14,
                backgroundColor: theme.colors.primary,
                borderRadius: 8,
              }}
              labelStyle={{ fontWeight: "700" }}
              textColor={theme.colors.onPrimary}
            >
              Unduh Laporan PDF
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Riwayat Sesi Absensi
          </Text>
        </View>

        {loading && !refreshing ? (
          <View style={styles.stateCard}>
            <ActivityIndicator size="small" />
            <Text style={styles.stateText}>Memuat rekap absensi...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateCard}>
            <MaterialIcons name="error-outline" size={20} color={theme.colors.error} />
            <Text style={[styles.stateText, { color: theme.colors.error }]}>{error}</Text>
          </View>
        ) : sesiList.length === 0 ? (
          <View style={styles.stateCard}>
            <MaterialIcons name="event-busy" size={20} color="#777" />
            <Text style={styles.stateText}>Belum ada sesi kuliah.</Text>
          </View>
        ) : (
          sesiList.map((item: any, index: number) => (
            <Pressable
              key={item.id}
              onPress={() => {
                router.push({
                  pathname: "/(dosen)/kelas/detail-absensi",
                  params: { sesiId: item.id },
                });
              }}
            >
              <Card style={styles.sessionCard}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <Text variant="titleMedium" style={styles.cardTitle}>
                      Pertemuan {sesiList.length - index}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            item.status_absensi === "buka"
                              ? theme.colors.primary
                              : "#6B7280",
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {String(item.status_absensi || "-").toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text variant="bodyMedium" style={styles.dateText}>
                    {item.tanggal_formatted}
                  </Text>

                  <View style={styles.timeRow}>
                    <Text variant="bodySmall" style={styles.timeText}>
                      Dibuka: {item.waktu_buka || "-"}
                    </Text>
                    <Text variant="bodySmall" style={styles.timeText}>
                      Ditutup: {item.waktu_tutup || "-"}
                    </Text>
                  </View>

                  {/* OTP Badge - tampil hanya jika sesi masih buka */}
                  {item.status_absensi === "buka" && item.otp_code && (
                    <View style={styles.otpBadge}>
                      <Text variant="labelSmall" style={styles.otpLabel}>
                        KODE OTP
                      </Text>
                      <Text variant="headlineSmall" style={styles.otpValue}>
                        {item.otp_code}
                      </Text>
                    </View>
                  )}

                  {/* <View style={styles.statRow}>
                    <Text style={styles.statItem}>Hadir: {item.jumlah_hadir}</Text>
                    <Text style={styles.statItem}>Izin: {item.jumlah_izin}</Text>
                    <Text style={styles.statItem}>Sakit: {item.jumlah_sakit}</Text>
                    <Text style={styles.statItem}>Alfa: {item.jumlah_alfa}</Text>
                  </View> */}
                </Card.Content>
              </Card>
            </Pressable>
          ))
        )}
      </ScrollView>

      <AnimatedFAB
        icon="plus"
        label="Tambah Sesi"
        extended={isExtended}
        visible
        onPress={toggleDialog}
        animateFrom="right"
        iconMode="static"
        variant="tertiary"
        style={styles.fabStyle}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={toggleDialog}>
          <Dialog.Title>Buka Sesi Absensi</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Anda akan membuka sesi absensi untuk mata kuliah ini.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={toggleDialog}>Batal</Button>
            <Button mode="contained" onPress={handleOpenSession} style={{ marginLeft: 8 }}>
              Lanjutkan
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={locationDialogVisible} onDismiss={toggleLocationDialog}>
          <Dialog.Title>Konfirmasi Lokasi Perkuliahan</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Apakah perkuliahan dilaksanakan di ruangan sesuai jadwal?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCreateSessionWithLocation}>Kelas Pengganti</Button>
            <Button mode="contained" onPress={() => createSession()}>
              Sesuai Jadwal
            </Button>
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
    paddingBottom: 90,
  },
  summaryCard: {
    borderRadius: 16,
    marginBottom: 14,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: "700",
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
  sessionCard: {
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: "white",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  dateText: {
    marginTop: 6,
    color: "#4B5563",
  },
  timeRow: {
    marginTop: 10,
    gap: 2,
  },
  timeText: {
    color: "#6B7280",
  },
  otpBadge: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FFF3CD",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFC107",
    alignItems: "center",
  },
  otpLabel: {
    color: "#856404",
    fontWeight: "bold",
  },
  otpValue: {
    color: "#000",
    fontWeight: "bold",
    letterSpacing: 8,
    marginTop: 4,
  },
  statRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 6,
    columnGap: 10,
  },
  statItem: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    color: "#374151",
    fontSize: 12,
    fontWeight: "600",
  },
  fabStyle: {
    position: "absolute",
    right: 16,
    bottom: 16,
    zIndex: 10,
  },
});
