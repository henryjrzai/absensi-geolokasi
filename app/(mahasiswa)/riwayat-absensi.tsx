import { getUserData } from "@/lib/auth-context";
import { getRiwayatAbsensiByJadwal } from "@/lib/models/absensi";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RiwayatAbsensi() {
  const { jadwalId } = useLocalSearchParams();
  const [riwayatAbsensi, setRiwayatAbsensi] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const theme = useTheme();

  const loadRiwayatAbsensi = async (jadwalId: number) => {
    try {
      const response = await getRiwayatAbsensiByJadwal(jadwalId);
      setRiwayatAbsensi(response.data);

      const user = await getUserData();
      setUser(user);
    } catch (e) {
      console.error("Error fetching riwayat absensi:", e);
      setError("Gagal memuat riwayat absensi.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRiwayatAbsensi(Number(jadwalId));
    setRefreshing(false);
  };

  useEffect(() => {
    if (jadwalId) {
      loadRiwayatAbsensi(Number(jadwalId));
    }
  }, [jadwalId]);

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView
        style={styles.scrollView}
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
          <Text style={styles.loadingText}>Loading...</Text>
        ) : error ? (
          <Text>Error: {error}</Text>
        ) : (
          <View>
            <Card>
              <Card.Content>
                <View style={styles.user}>
                  <View style={styles.rowData}>
                    <Text style={{ flex: 0, minWidth: 80 }}>Nama</Text>
                    <Text style={{ marginHorizontal: 10 }}>:</Text>
                    <Text style={{ flex: 1 }}>{user?.nama}</Text>
                  </View>
                  <View style={styles.rowData}>
                    <Text style={{ flex: 0, minWidth: 80 }}>NPM</Text>
                    <Text style={{ marginHorizontal: 10 }}>:</Text>
                    <Text style={{ flex: 1 }}>{user?.npm}</Text>
                  </View>
                </View>
                <View>
                  <View style={styles.rowData}>
                    <Text style={{ flex: 0, minWidth: 80 }}>Dosen</Text>
                    <Text style={{ marginHorizontal: 10 }}>:</Text>
                    <Text style={{ flex: 1 }}>
                      {riwayatAbsensi.dosen?.nama}
                    </Text>
                  </View>
                  <View style={styles.rowData}>
                    <Text style={{ flex: 0, minWidth: 80 }}>Matakuliah</Text>
                    <Text style={{ marginHorizontal: 10 }}>:</Text>
                    <Text style={{ flex: 1 }}>
                      {riwayatAbsensi.kelas?.nama_kelas}
                    </Text>
                  </View>
                  <View style={styles.rowData}>
                    <Text style={{ flex: 0, minWidth: 80 }}>Pertemuan</Text>
                    <Text style={{ marginHorizontal: 10 }}>:</Text>
                    <Text style={{ flex: 1, textTransform: "capitalize" }}>
                      {riwayatAbsensi.jadwal?.tipe_pertemuan}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* <Text>{jadwalId}</Text> */}

            <View style={styles.statistikContainer}>
              <View
                style={[{ backgroundColor: "#23bf1dff" }, styles.statistikItem]}
              >
                <Feather name="check-circle" size={20} color="white" />
                <Text variant="titleLarge" style={styles.statistikText}>
                  {riwayatAbsensi.statistik?.hadir}
                </Text>
                <Text style={styles.statistikText}>HADIR</Text>
              </View>
              <View
                style={[{ backgroundColor: "#d1271aff" }, styles.statistikItem]}
              >
                <Feather name="x-octagon" size={20} color="white" />
                <Text variant="titleLarge" style={styles.statistikText}>
                  {riwayatAbsensi.statistik?.alfa}
                </Text>
                <Text style={styles.statistikText}>ALPA</Text>
              </View>
              <View
                style={[styles.statistikItem, { backgroundColor: "#bec718ff" }]}
              >
                <Feather name="check-circle" size={20} color="white" />
                <Text variant="titleLarge" style={styles.statistikText}>
                  {riwayatAbsensi.statistik?.izin}
                </Text>
                <Text style={styles.statistikText}>IZIN</Text>
              </View>
              <View
                style={[styles.statistikItem, { backgroundColor: "#11a9bdff" }]}
              >
                <MaterialIcons name="local-hospital" size={20} color="white" />
                <Text variant="titleLarge" style={styles.statistikText}>
                  {riwayatAbsensi.statistik?.sakit}
                </Text>
                <Text style={styles.statistikText}>SAKIT</Text>
              </View>
            </View>

            <View style={{ marginTop: 20 }}>
              {riwayatAbsensi.riwayat_absensi.length > 0 ? (
                riwayatAbsensi.riwayat_absensi.map((absen: any) => (
                  <Card
                    key={absen.sesi_kuliah_id}
                    style={{
                      marginBottom: 10,
                      backgroundColor: theme.colors.tertiaryContainer,
                    }}
                  >
                    <Card.Content>
                      <Text>{absen.tanggal}</Text>
                      <Text
                        variant="headlineSmall"
                        style={{ textTransform: "capitalize" }}
                      >
                        {absen.status}
                      </Text>
                      {absen.pengajuan_izin_sakit && (
                        <View style={{ marginTop: 10 }}>
                          <Text variant="titleMedium">Status Validasi:</Text>
                          <Text>
                            {absen.pengajuan_izin_sakit.status_validasi ===
                            "pending"
                              ? "⌚ Pengajuan belum divalidasi dosen"
                              : absen.pengajuan_izin_sakit.status_validasi ===
                                "diterima"
                              ? "✅ Pengajuan diterima"
                              : absen.pengajuan_izin_sakit.status_validasi ===
                                "ditolak"
                              ? "❌ Pengajuan ditolak"
                              : absen.pengajuan_izin_sakit.status_validasi}
                          </Text>
                          {absen.pengajuan_izin_sakit.keterangan && (
                            <View style={{ marginTop: 8 }}>
                              <Text variant="titleMedium">Keterangan:</Text>
                              <Text>
                                {absen.pengajuan_izin_sakit.keterangan}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </Card.Content>
                  </Card>
                ))
              ) : (
                <Card style={{ backgroundColor: theme.colors.surfaceVariant }}>
                  <Card.Content>
                    <Text
                      style={{
                        textAlign: "center",
                        color: theme.colors.onSurfaceVariant,
                        fontStyle: "italic",
                      }}
                    >
                      Data riwayat absensi tidak tersedia
                    </Text>
                  </Card.Content>
                </Card>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { padding: 16 },
  loadingText: {
    marginTop: 20,
    textAlign: "center",
    color: "gray",
  },
  user: { marginBottom: 10 },
  rowData: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  statistikContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  statistikItem: {
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },
  statistikText: {
    color: "white",
  },
});
