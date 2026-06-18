import {
  editStatusAbsensiMahasiswa,
  getDetailSesiAbsensi,
  tutupSesiAbsensi,
} from "@/lib/models/absensi";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { API_URL } from "@/lib/apiConfig";
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  Dialog,
  RadioButton,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function DetailAbsensi() {
  const { sesiId } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [detailData, setDetailData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [closingSession, setClosingSession] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("hadir");
  const [downloading, setDownloading] = useState<boolean>(false);
  const theme = useTheme();

  const hideDialog = () => setVisibleDialog(false);

  const handleShowEditDialog = (data: any) => {
    setEditData(data);
    setSelectedStatus(data.absensi?.status || "alfa");
    setVisibleDialog(true);
  };

  const loadDetailAbsensi = async (currentSesiId: number) => {
    try {
      const result = await getDetailSesiAbsensi(currentSesiId);
      if (result.status) {
        setDetailData(result.data);
        setError(null);
      } else {
        setError(result.message || "Gagal memuat detail absensi.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sesiId) {
      loadDetailAbsensi(Number(sesiId));
    }
  }, [sesiId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDetailAbsensi(Number(sesiId));
    setRefreshing(false);
  };

  const handleEditStatus = async () => {
    if (!editData || !selectedStatus) return;
    try {
      const result = await editStatusAbsensiMahasiswa(
        Number(sesiId),
        editData.mahasiswa_id,
        selectedStatus
      );
      if (result?.status) {
        Alert.alert("Sukses", "Status absensi berhasil diubah.");
        await loadDetailAbsensi(Number(sesiId));
        hideDialog();
      } else {
        Alert.alert("Error", result?.message || "Gagal mengubah status absensi.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Terjadi kesalahan.");
    }
  };

  const handleTutupSesi = () => {
    Alert.alert(
      "Tutup Sesi Absensi",
      "Apakah Anda yakin ingin menutup sesi absensi ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Tutup",
          style: "destructive",
          onPress: async () => {
            setClosingSession(true);
            try {
              const result = await tutupSesiAbsensi(Number(sesiId));
              if (result?.status) {
                Alert.alert("Sukses", "Sesi absensi berhasil ditutup.");
                await loadDetailAbsensi(Number(sesiId));
              } else {
                Alert.alert("Error", result?.message || "Gagal menutup sesi absensi.");
              }
            } catch (err: any) {
              Alert.alert("Error", err.message || "Terjadi kesalahan saat menutup sesi.");
            } finally {
              setClosingSession(false);
            }
          },
        },
      ]
    );
  };

  const handleLihatPengajuan = () => {
    router.push({
      pathname: "/(dosen)/kelas/pengajuanIzinSakit",
      params: { sesiId: String(sesiId) },
    });
  };

  const handleDownloadPDF = async () => {
    if (!sesiId) {
      Alert.alert("Error", "ID Sesi tidak ditemukan.");
      return;
    }

    try {
      setDownloading(true);
      const token = await AsyncStorage.getItem("token");
      
      const downloadUrl = `${API_URL}/absensi/sesi/${sesiId}/export`;
      const filename = `Laporan_Absensi_Sesi_${sesiId}.pdf`;
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
            dialogTitle: "Unduh Laporan Sesi Absensi",
            UTI: "com.adobe.pdf",
          });
        } else {
          Alert.alert("Sukses", `File berhasil diunduh ke: ${fileUri}`);
        }
      } else {
        Alert.alert("Gagal", "Gagal mengunduh file laporan sesi absensi.");
      }
    } catch (err: any) {
      console.error("Download error:", err);
      Alert.alert("Error", err.message || "Terjadi kesalahan saat mengunduh laporan.");
    } finally {
      setDownloading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "hadir":
        return "#16A34A";
      case "izin":
        return "#CA8A04";
      case "sakit":
        return "#0284C7";
      case "alpha":
      case "alfa":
        return "#DC2626";
      default:
        return "#6B7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "hadir":
        return "check-circle";
      case "izin":
        return "file-document";
      case "sakit":
        return "hospital-box";
      case "alpha":
      case "alfa":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  const filteredDaftarAbsensi = detailData?.absensi?.daftar?.filter((item: any) => {
    const query = searchQuery.toLowerCase();
    return (
      item.npm.toLowerCase().includes(query) || item.nama.toLowerCase().includes(query)
    );
  });

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
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
        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator size="small" />
            <Text style={styles.stateText}>Memuat detail absensi...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateCard}>
            <MaterialIcons name="error-outline" size={20} color={theme.colors.error} />
            <Text style={[styles.stateText, { color: theme.colors.error }]}>{error}</Text>
          </View>
        ) : !detailData ? (
          <View style={styles.stateCard}>
            <MaterialIcons name="inbox" size={20} color="#777" />
            <Text style={styles.stateText}>Tidak ada data absensi.</Text>
          </View>
        ) : (
          <>
            <Card style={[styles.headerCard, { backgroundColor: theme.colors.primaryContainer }]}>
              <Card.Content>
                <Text
                  variant="titleLarge"
                  style={{ fontWeight: "800", color: theme.colors.onPrimaryContainer }}
                >
                  Absensi {detailData.tanggal}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ marginTop: 4, color: theme.colors.onPrimaryContainer }}
                >
                 Kelas :  {detailData.kelas?.nama_kelas} • {detailData.kelas?.matakuliah?.nama}
                </Text>
              </Card.Content>
            </Card>

            <Card
              style={[
                styles.statusCard,
                { backgroundColor: detailData.status === "buka" ? "#16A34A" : "#6B7280" },
              ]}
            >
              <Card.Content>
                <Text variant="bodyLarge" style={styles.statusText}>
                  Sesi absensi: {String(detailData.status || "-").toUpperCase()}
                </Text>
              </Card.Content>
            </Card>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Cari berdasarkan NPM atau nama"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery !== "" && (
                <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery("")}>
                  <Text style={styles.clearButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>

            <Card style={styles.summaryCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.summaryTitle}>
                  Ringkasan Kehadiran
                </Text>
                <View style={styles.summaryGrid}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Hadir</Text>
                    <Text style={styles.summaryValue}>{detailData.absensi?.hadir || 0}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Izin</Text>
                    <Text style={styles.summaryValue}>{detailData.absensi?.izin || 0}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Sakit</Text>
                    <Text style={styles.summaryValue}>{detailData.absensi?.sakit || 0}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Alfa</Text>
                    <Text style={styles.summaryValue}>{detailData.absensi?.alpha || 0}</Text>
                  </View>
                </View>
                <Text style={styles.totalText}>
                  Total mahasiswa: {detailData.absensi?.total_mahasiswa || 0}
                </Text>
                <Button mode="contained-tonal" onPress={handleLihatPengajuan} style={{ marginTop: 10 }}>
                  Lihat Pengajuan Izin/Sakit
                </Button>
                <Button
                  icon="file-pdf-box"
                  mode="contained"
                  onPress={handleDownloadPDF}
                  loading={downloading}
                  disabled={downloading || !detailData}
                  style={{
                    marginTop: 10,
                    backgroundColor: theme.colors.primary,
                    borderRadius: 8,
                  }}
                  labelStyle={{ fontWeight: "700" }}
                  textColor={theme.colors.onPrimary}
                >
                  Unduh Laporan Sesi PDF
                </Button>
              </Card.Content>
            </Card>

            {filteredDaftarAbsensi && filteredDaftarAbsensi.length > 0 ? (
              filteredDaftarAbsensi.map((item: any) => (
                <Card key={item.mahasiswa_id} style={styles.mahasiswaCard}>
                  <Card.Content>
                    <View style={styles.mahasiswaHeader}>
                      <Text variant="titleMedium" style={styles.mahasiswaNama}>
                        {item.npm} - {item.nama}
                      </Text>
                      {closingSession ? null : (
                        <Button mode="text" onPress={() => handleShowEditDialog(item)}>
                          <Feather name="edit" size={18} color="#111" />
                        </Button>
                      )}
                    </View>
                    <Chip
                      icon={getStatusIcon(item.absensi?.status || "alpha")}
                      style={[
                        styles.statusChip,
                        { backgroundColor: getStatusColor(item.absensi?.status || "alpha") },
                      ]}
                      textStyle={styles.statusChipText}
                    >
                      {item.absensi?.status
                        ? item.absensi.status.charAt(0).toUpperCase() + item.absensi.status.slice(1)
                        : "Alfa"}
                    </Chip>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text>
                  {searchQuery
                    ? "Tidak ada mahasiswa yang sesuai pencarian."
                    : "Belum ada data absensi."}
                </Text>
              </View>
            )}

            {detailData.status === "buka" && (
              <Button
                mode="contained"
                style={styles.actionButton}
                buttonColor="#DC2626"
                onPress={handleTutupSesi}
                loading={closingSession}
                disabled={closingSession}
              >
                {closingSession ? "Menutup sesi..." : "Tutup Sesi Absensi"}
              </Button>
            )}
          </>
        )}
      </ScrollView>

      <Dialog visible={visibleDialog} onDismiss={hideDialog}>
        <Dialog.Title>Edit Status Absensi</Dialog.Title>
        <Dialog.Content>
          <Text>Nama: {editData?.nama}</Text>
          <Text>NPM: {editData?.npm}</Text>
          <View style={{ marginTop: 16 }}>
            <Text>Pilih status:</Text>
            <RadioButton.Group value={selectedStatus} onValueChange={setSelectedStatus}>
              <RadioButton.Item label="Hadir" value="hadir" />
              <RadioButton.Item label="Izin" value="izin" />
              <RadioButton.Item label="Sakit" value="sakit" />
              <RadioButton.Item label="Alfa" value="alfa" />
            </RadioButton.Group>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Batal</Button>
          <Button onPress={handleEditStatus}>Simpan</Button>
        </Dialog.Actions>
      </Dialog>
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
  headerCard: {
    borderRadius: 16,
    marginBottom: 10,
  },
  statusCard: {
    borderRadius: 12,
    marginBottom: 14,
  },
  statusText: {
    color: "white",
    fontWeight: "700",
  },
  searchContainer: {
    marginBottom: 12,
    position: "relative",
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  clearButton: {
    position: "absolute",
    right: 12,
    top: 10,
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 13,
  },
  clearButtonText: {
    fontSize: 18,
    color: "#666",
    lineHeight: 20,
  },
  summaryCard: {
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "white",
  },
  summaryTitle: {
    fontWeight: "700",
    marginBottom: 10,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },
  summaryItem: {
    width: "48%",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  summaryLabel: {
    color: "#6B7280",
    fontSize: 12,
  },
  summaryValue: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  totalText: {
    marginTop: 10,
    color: "#374151",
    fontWeight: "600",
  },
  mahasiswaCard: {
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "white",
  },
  mahasiswaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mahasiswaNama: {
    fontWeight: "600",
    flex: 1,
    paddingRight: 8,
  },
  statusChip: {
    alignSelf: "flex-start",
    marginTop: 8,
  },
  statusChipText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  actionButton: {
    marginTop: 8,
    borderRadius: 10,
  },
});
