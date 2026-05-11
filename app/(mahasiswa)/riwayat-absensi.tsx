import { getUserData } from "@/lib/auth-context";
import { getRiwayatAbsensiByJadwal } from "@/lib/models/absensi";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Card, Text, useTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RiwayatAbsensi() {
  const { jadwalId } = useLocalSearchParams();
  const [riwayatAbsensi, setRiwayatAbsensi] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const theme = useTheme();

  const loadRiwayatAbsensi = async (currentJadwalId: number) => {
    try {
      const response = await getRiwayatAbsensiByJadwal(currentJadwalId);
      setRiwayatAbsensi(response.data);
      setError(null);

      const currentUser = await getUserData();
      setUser(currentUser);
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

  const getStatusColor = (status?: string) => {
    switch ((status || "").toLowerCase()) {
      case "hadir":
        return "#16A34A";
      case "izin":
        return "#CA8A04";
      case "sakit":
        return "#0284C7";
      case "alfa":
      case "alpha":
        return "#DC2626";
      default:
        return "#6B7280";
    }
  };

  const getValidationLabel = (status?: string) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "Menunggu validasi dosen";
      case "diterima":
        return "Pengajuan diterima";
      case "ditolak":
        return "Pengajuan ditolak";
      default:
        return status || "-";
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
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
            <Text style={styles.stateText}>Memuat riwayat absensi...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateCard}>
            <MaterialIcons
              name="error-outline"
              size={20}
              color={theme.colors.error}
            />
            <Text style={[styles.stateText, { color: theme.colors.error }]}>
              {error}
            </Text>
          </View>
        ) : (
          <View>
            <Card
              style={[
                styles.headerCard,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <Card.Content>
                <Text
                  variant="titleMedium"
                  style={{ color: theme.colors.onPrimaryContainer, fontWeight: "800" }}
                >
                  Riwayat Kehadiran
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onPrimaryContainer, marginTop: 4 }}
                >
                  {riwayatAbsensi?.kelas?.nama_kelas || "-"}
                </Text>

                <View style={styles.metaBlock}>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Mahasiswa</Text>
                    <Text style={styles.metaValue}>{user?.nama || "-"}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>NPM</Text>
                    <Text style={styles.metaValue}>{user?.npm || "-"}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Dosen</Text>
                    <Text style={styles.metaValue}>{riwayatAbsensi?.dosen?.nama || "-"}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Pertemuan</Text>
                    <Text style={styles.metaValue}>
                      {(riwayatAbsensi?.jadwal?.tipe_pertemuan || "-").toString()}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: "#16A34A" }]}>
                <Feather name="check-circle" size={18} color="white" />
                <Text style={styles.statValue}>{riwayatAbsensi?.statistik?.hadir || 0}</Text>
                <Text style={styles.statLabel}>HADIR</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: "#DC2626" }]}>
                <Feather name="x-circle" size={18} color="white" />
                <Text style={styles.statValue}>{riwayatAbsensi?.statistik?.alfa || 0}</Text>
                <Text style={styles.statLabel}>ALFA</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: "#CA8A04" }]}>
                <Feather name="file-text" size={18} color="white" />
                <Text style={styles.statValue}>{riwayatAbsensi?.statistik?.izin || 0}</Text>
                <Text style={styles.statLabel}>IZIN</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: "#0284C7" }]}>
                <MaterialIcons name="local-hospital" size={18} color="white" />
                <Text style={styles.statValue}>{riwayatAbsensi?.statistik?.sakit || 0}</Text>
                <Text style={styles.statLabel}>SAKIT</Text>
              </View>
            </View>

            <Text variant="titleMedium" style={styles.sectionTitle}>
              Detail Pertemuan
            </Text>

            {riwayatAbsensi?.riwayat_absensi?.length > 0 ? (
              riwayatAbsensi.riwayat_absensi.map((absen: any) => (
                <Card key={absen.sesi_kuliah_id} style={styles.historyCard}>
                  <Card.Content>
                    <View style={styles.historyHead}>
                      <Text variant="bodyMedium" style={styles.dateText}>
                        {absen.tanggal}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(absen.status) },
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {(absen.status || "-").toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    {absen.pengajuan_izin_sakit && (
                      <View style={styles.validationBox}>
                        <Text variant="labelMedium" style={styles.validationTitle}>
                          Status Validasi
                        </Text>
                        <Text variant="bodyMedium">
                          {getValidationLabel(absen.pengajuan_izin_sakit.status_validasi)}
                        </Text>
                        {absen.pengajuan_izin_sakit.keterangan ? (
                          <Text variant="bodySmall" style={styles.validationDesc}>
                            {absen.pengajuan_izin_sakit.keterangan}
                          </Text>
                        ) : null}
                      </View>
                    )}
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Card style={styles.emptyCard}>
                <Card.Content>
                  <Text style={styles.emptyText}>
                    Data riwayat absensi belum tersedia.
                  </Text>
                </Card.Content>
              </Card>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FC",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
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
    marginBottom: 14,
  },
  metaBlock: {
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 12,
    padding: 10,
    gap: 6,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  metaLabel: {
    fontSize: 13,
    color: "#5A4A3C",
  },
  metaValue: {
    fontSize: 13,
    color: "#2A2018",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginBottom: 16,
  },
  statCard: {
    width: "48.5%",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  statValue: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
  },
  statLabel: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
    letterSpacing: 0.6,
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 10,
  },
  historyCard: {
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "white",
  },
  historyHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    color: "#666",
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
  validationBox: {
    marginTop: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 10,
  },
  validationTitle: {
    fontWeight: "700",
    marginBottom: 2,
  },
  validationDesc: {
    marginTop: 6,
    color: "#555",
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
});
