import KaprodiKelasCard from "@/components/KaprodiKelasCard";
import { getDaftarKelasKaprodi } from "@/lib/models/kaprodi";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Button, Menu, Text, useTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

const SEMESTER_OPTIONS = [
  { label: "Semua Semester", value: "" },
  { label: "Semester 1", value: "1" },
  { label: "Semester 2", value: "2" },
  { label: "Semester 3", value: "3" },
  { label: "Semester 4", value: "4" },
  { label: "Semester 5", value: "5" },
  { label: "Semester 6", value: "6" },
  { label: "Semester 7", value: "7" },
  { label: "Semester 8", value: "8" },
];

export default function KaprodiIndex() {
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [namaProdi, setNamaProdi] = useState<string | null>(null);

  const loadKelas = async (semester: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getDaftarKelasKaprodi(semester || undefined);
      if (result.status) {
        setKelasList(result.data);
        setNamaProdi(result.meta?.prodi ?? null);
      } else {
        setError(result.message || "Gagal memuat daftar kelas.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKelas(selectedSemester);
  }, [selectedSemester]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadKelas(selectedSemester);
    setRefreshing(false);
  };

  const getSelectedSemesterLabel = () => {
    const selected = SEMESTER_OPTIONS.find(
      (option) => option.value === selectedSemester
    );
    return selected ? selected.label : "Pilih Semester";
  };

  return (
    <SafeAreaProvider style={styles.container}>
      {namaProdi && (
        <Text variant="titleMedium" style={styles.prodiTitle}>
          Program Studi: {namaProdi}
        </Text>
      )}

      <View style={styles.filterContainer}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(!menuVisible)}
              icon="filter-variant"
              style={styles.filterButton}
              contentStyle={styles.filterButtonContent}
            >
              {getSelectedSemesterLabel()}
            </Button>
          }
          anchorPosition="bottom"
        >
          {SEMESTER_OPTIONS.map((option) => (
            <Menu.Item
              key={option.value}
              onPress={() => {
                setSelectedSemester(option.value);
                setMenuVisible(false);
              }}
              title={option.label}
              leadingIcon={
                selectedSemester === option.value ? "check" : undefined
              }
            />
          ))}
        </Menu>
      </View>

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
        {loading ? (
          <Text>Memuat daftar kelas...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : kelasList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              Tidak ada kelas
              {selectedSemester ? ` pada semester ${selectedSemester}` : ""}
            </Text>
          </View>
        ) : (
          kelasList.map((kelas) => (
            <KaprodiKelasCard
              key={kelas.jadwal_id}
              kelas={kelas}
              onPress={() =>
                router.push({
                  pathname: "/(dosen)/kelas/rekap-absensi",
                  params: { jadwalId: kelas.jadwal_id.toString() },
                })
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  prodiTitle: {
    marginBottom: 12,
    fontWeight: "700",
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    marginBottom: 8,
  },
  filterButtonContent: {
    justifyContent: "flex-start",
  },
  errorText: {
    color: "#B00020",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
  },
});
