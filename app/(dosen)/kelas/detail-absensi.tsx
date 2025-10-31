import {
  editStatusAbsensiMahasiswa,
  getDetailSesiAbsensi,
  tutupSesiAbsensi,
} from "@/lib/models/absensi";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import { hide } from "expo-router/build/utils/splash";
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
import {
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

  const theme = useTheme();

  const hideDialog = () => {
    setVisibleDialog(false);
  };

  const handleShowEditDialog = (data: any) => {
    setEditData(data);
    setSelectedStatus(data.absensi?.status || "alfa");
    setVisibleDialog(true);
  };

  const handleEditStatus = async () => {
    if (!editData && !selectedStatus) return;
    try {
      const result = await editStatusAbsensiMahasiswa(
        Number(sesiId),
        editData.mahasiswa_id,
        selectedStatus
      );
      if (result.status) {
        Alert.alert("Sukses", "Status absensi berhasil diubah");
        await loadDetailAbsensi(Number(sesiId));
        hideDialog();
      } else {
        Alert.alert("Error", result.message || "Gagal mengubah status absensi");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Terjadi kesalahan");
    }
  };

  const loadDetailAbsensi = async (sesiId: number) => {
    try {
      const result = await getDetailSesiAbsensi(sesiId);
      if (result.status) {
        setDetailData(result.data);
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
    setLoading(true);
    await loadDetailAbsensi(Number(sesiId));
    setRefreshing(false);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "hadir":
        return "#4CAF50";
      case "izin":
        return "#2196F3";
      case "sakit":
        return "#FF9800";
      case "alpha":
      case "alfa":
        return "#F44336";
      default:
        return "#757575";
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

  const filteredDaftarAbsensi = detailData?.absensi?.daftar?.filter(
    (item: any) => {
      const query = searchQuery.toLowerCase();
      return (
        item.npm.toLowerCase().includes(query) ||
        item.nama.toLowerCase().includes(query)
      );
    }
  );

  const handleTutupSesi = () => {
    Alert.alert(
      "Tutup Sesi Absensi",
      "Apakah Anda yakin ingin menutup sesi absensi ini?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Tutup",
          style: "destructive",
          onPress: async () => {
            setClosingSession(true);
            try {
              const result = await tutupSesiAbsensi(Number(sesiId));
              if (result.status) {
                Alert.alert("Sukses", "Sesi absensi berhasil ditutup");
                await loadDetailAbsensi(Number(sesiId));
              } else {
                Alert.alert(
                  "Error",
                  result.message || "Gagal menutup sesi absensi"
                );
              }
            } catch (err: any) {
              Alert.alert(
                "Error",
                err.message || "Terjadi kesalahan saat menutup sesi"
              );
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
      params: { sesiId: sesiId.toString() },
    });
  };

  if (loading) {
    return (
      <SafeAreaProvider style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Memuat detail absensi...
        </Text>
      </SafeAreaProvider>
    );
  }

  if (error) {
    return (
      <SafeAreaProvider style={styles.container}>
        <Text style={{ color: "red" }}>{error}</Text>
      </SafeAreaProvider>
    );
  }

  if (!detailData) {
    return (
      <SafeAreaProvider style={styles.container}>
        <Text>Tidak ada data.</Text>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView
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
        {/* Header Info */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Absensi {detailData.tanggal}
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {detailData.kelas?.nama_kelas} •{" "}
              {detailData.kelas?.matakuliah?.nama}
            </Text>
          </Card.Content>
        </Card>

        {/* Status Sesi */}
        <Card
          style={[
            styles.statusCard,
            {
              backgroundColor:
                detailData.status === "buka" ? "#4CAF50" : "#757575",
            },
          ]}
        >
          <Card.Content>
            <Text variant="bodyLarge" style={styles.statusText}>
              ✓ Sesi absensi di {detailData.status}
            </Text>
          </Card.Content>
        </Card>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="cari berdasarkan npm atau nama"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery("")}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* List Mahasiswa */}
        {filteredDaftarAbsensi && filteredDaftarAbsensi.length > 0 ? (
          filteredDaftarAbsensi.map((item: any) => (
            <Card key={item.mahasiswa_id} style={styles.mahasiswaCard}>
              <Card.Content>
                <View style={styles.mahasiswaInfo}>
                  <View style={styles.mahasiswaTextContainer}>
                    <Text variant="titleMedium" style={styles.mahasiswaNama}>
                      {item.npm} - {item.nama}
                    </Text>
                    <View style={styles.statusContainer}>
                      <Chip
                        icon={getStatusIcon(item.absensi?.status || "alpha")}
                        style={[
                          styles.statusChip,
                          {
                            backgroundColor: getStatusColor(
                              item.absensi?.status || "alpha"
                            ),
                          },
                        ]}
                        textStyle={styles.statusChipText}
                      >
                        {item.absensi?.status
                          ? item.absensi.status.charAt(0).toUpperCase() +
                            item.absensi.status.slice(1)
                          : "Alpha"}
                      </Chip>
                      <Button
                        mode="text"
                        onPress={() => handleShowEditDialog(item)}
                      >
                        <Feather name="edit" size={20} color="black" />
                      </Button>
                    </View>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text>
              {searchQuery
                ? "Tidak ada mahasiswa yang sesuai pencarian"
                : "Belum ada data absensi"}
            </Text>
          </View>
        )}

        {/* Button Tutup Sesi - Hanya muncul saat sesi buka */}
        {detailData.status === "buka" && (
          <Button
            mode="contained"
            style={styles.actionButton}
            buttonColor="#F44336"
            onPress={handleTutupSesi}
            loading={closingSession}
            disabled={closingSession}
          >
            {closingSession ? "Menutup Sesi..." : "TUTUP SESI ABSENSI"}
          </Button>
        )}

        {/* Summary Statistics */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.summaryTitle}>
              Ringkasan Kehadiran
            </Text>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium">✅ Hadir:</Text>
              <Text variant="bodyMedium">{detailData.absensi?.hadir || 0}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium">📝 Izin:</Text>
              <Text variant="bodyMedium">{detailData.absensi?.izin || 0}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium">🏥 Sakit:</Text>
              <Text variant="bodyMedium">{detailData.absensi?.sakit || 0}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium">❌ Alpha:</Text>
              <Text variant="bodyMedium">{detailData.absensi?.alpha || 0}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text variant="bodyLarge" style={styles.summaryTotalText}>
                Total:
              </Text>
              <Text variant="bodyLarge" style={styles.summaryTotalText}>
                {detailData.absensi?.total_mahasiswa || 0} mahasiswa
              </Text>
            </View>
            <Button mode="contained-tonal" onPress={handleLihatPengajuan}>
              Lihat Pengajuan Izin/Sakit
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      <Dialog visible={visibleDialog} onDismiss={hideDialog}>
        <Dialog.Title>Edit Absensi</Dialog.Title>
        <Dialog.Content>
          <Text>Nama : {editData?.nama}</Text>
          <Text>NPM : {editData?.npm}</Text>
          <View style={{ marginTop: 16 }}>
            <Text>Pilih Status :</Text>
            <RadioButton.Group
              onValueChange={(newValue) => setSelectedStatus(newValue)}
              value={selectedStatus}
            >
              <RadioButton.Item label="Hadir" value="hadir" />
              <RadioButton.Item label="Izin" value="izin" />
              <RadioButton.Item label="Sakit" value="sakit" />
              <RadioButton.Item label="Alfa" value="alfa" />
            </RadioButton.Group>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => hideDialog()}>Batal</Button>
          <Button onPress={() => handleEditStatus()}>Simpan Perubahan</Button>
        </Dialog.Actions>
      </Dialog>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    color: "#666",
    marginTop: 4,
  },
  statusCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    position: "relative",
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  clearButton: {
    position: "absolute",
    right: 15,
    top: 10,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
  },
  clearButtonText: {
    fontSize: 18,
    color: "#666",
  },
  mahasiswaCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "white",
  },
  mahasiswaInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mahasiswaTextContainer: {
    flex: 1,
  },
  mahasiswaNama: {
    fontWeight: "500",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusChip: {
    alignSelf: "flex-start",
  },
  statusChipText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  actionButton: {
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 8,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: "white",
  },
  summaryTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  summaryTotalText: {
    fontWeight: "bold",
  },
});
