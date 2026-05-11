import { JadwalItem } from "@/components/JadwalItem";
import { getScheduleByStudent } from "@/lib/models/jadwal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Card, Text, useTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Jadwal() {
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const loadJadwal = async () => {
    try {
      const result = await getScheduleByStudent();
      if (result.status) {
        setJadwal(result.data);
        setError(null);
      } else {
        setError(result.message || "Gagal memuat jadwal.");
      }
    } catch (err) {
      console.log("Error loading jadwal:", err);
      setError("Gagal memuat jadwal.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJadwal();
    setRefreshing(false);
  };

  useEffect(() => {
    loadJadwal();
  }, []);

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
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Daftar Jadwal
          </Text>
        </View>

        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator size="small" />
            <Text style={styles.stateText}>Memuat jadwal...</Text>
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
        ) : jadwal.length === 0 ? (
          <View style={styles.stateCard}>
            <MaterialIcons name="event-busy" size={20} color="#777" />
            <Text style={styles.stateText}>Tidak ada jadwal yang tersedia.</Text>
          </View>
        ) : (
          jadwal.map((item) => (
            <Card style={styles.scheduleCard} key={item.jadwal_id}>
              <Card.Content>
                <JadwalItem
                  id={item.jadwal_id}
                  namaKelas={item.kelas.nama_kelas}
                  tipePertemuan={item.tipe_pertemuan}
                  hari={item.hari}
                  kodeJam={item.jam.kode_jam}
                  jamMulai={item.jam.jam_mulai}
                  jamSelesai={item.jam.jam_selesai}
                  ruangan={item.ruangan.nama_ruangan}
                />
              </Card.Content>
            </Card>
          ))
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
  content: {
    padding: 16,
    paddingBottom: 20,
  },
  summaryCard: {
    borderRadius: 16,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  scheduleCard: {
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: "white",
  },
});
