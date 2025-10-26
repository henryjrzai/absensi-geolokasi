import { JadwalItem } from "@/components/JadwalItem";
import { getScheduleByStudent } from "@/lib/models/jadwal";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Jadwal() {
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const loadJadwal = async () => {
    const result = await getScheduleByStudent();
    if (result.status) {
      setJadwal(result.data);
      setLoading(false);
    } else {
      setError(result.message || "Gagal memuat jadwal.");
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    await loadJadwal();
    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    loadJadwal();
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      {error && <Text>{error}</Text>}
      {loading ? (
        <Text style={{ textAlign: "center", marginVertical: 12 }}>Loading...</Text>
      ) : (
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
          {jadwal.map((item) => (
            <Card style={{ marginVertical: 6 }} key={item.jadwal_id}>
              <Card.Content>
                <JadwalItem
                  id={item.jadwal_id}
                  namaKelas={item.kelas.nama_kelas}
                  tipePertemuan={item.tipe_pertemuan}
                  hari={item.hari}
                  kodeJam={item.jam.kode_jam}
                  ruangan={item.ruangan.nama_ruangan}
                />
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
