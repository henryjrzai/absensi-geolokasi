import ClassDosenItem from "@/components/ClassDosenItem";
import { getCoursesByLecturer } from "@/lib/models/kelas";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card, Menu, Text, useTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

const HARI_OPTIONS = [
  { label: "Semua Hari", value: "" },
  { label: "Senin", value: "senin" },
  { label: "Selasa", value: "selasa" },
  { label: "Rabu", value: "rabu" },
  { label: "Kamis", value: "kamis" },
  { label: "Jumat", value: "jumat" },
  { label: "Sabtu", value: "sabtu" },
  { label: "Minggu", value: "minggu" },
];

export default function Kelas() {
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [classList, setClassList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedHari, setSelectedHari] = useState<string>("");
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadClass = async () => {
    const result = await getCoursesByLecturer();
    if (result.status) {
      setClassList(result.data);
    } else {
      setError(result.message || "Gagal memuat daftar kelas.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadClass();
  }, []);

  // Filter classList berdasarkan hari yang dipilih
  const filteredClassList = useMemo(() => {
    if (!selectedHari) {
      return classList;
    }
    return classList.filter((classItem) => classItem.hari === selectedHari);
  }, [classList, selectedHari]);

  const getSelectedHariLabel = () => {
    const selected = HARI_OPTIONS.find(
      (option) => option.value === selectedHari
    );
    return selected ? selected.label : "Pilih Hari";
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClass();
    setRefreshing(false);
  };

  const handleClassPress = (jadwalId: number) => {
    router.push({
      pathname: "/rekap-absensi",
      params: {
        jadwalId: jadwalId.toString(),
      },
    });
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.filterContainer}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(!menuVisible)}
              icon="calendar"
              style={styles.filterButton}
              contentStyle={styles.filterButtonContent}
            >
              {getSelectedHariLabel()}
            </Button>
          }
          anchorPosition="bottom"
        >
          {HARI_OPTIONS.map((option) => (
            <Menu.Item
              key={option.value}
              onPress={() => {
                setSelectedHari(option.value);
                setMenuVisible(false);
              }}
              title={option.label}
              leadingIcon={selectedHari === option.value ? "check" : undefined}
            />
          ))}
        </Menu>
        {selectedHari !== "" && (
          <Text variant="bodySmall" style={styles.filterInfo}>
            Menampilkan {filteredClassList.length} kelas
          </Text>
        )}
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
          <Text>{error}</Text>
        ) : filteredClassList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              Tidak ada kelas {selectedHari ? `pada hari ${selectedHari}` : ""}
            </Text>
          </View>
        ) : (
          filteredClassList.map((classItem) => (
            <Pressable
              key={classItem.jadwal_id}
              onPress={() => handleClassPress(classItem.jadwal_id)}
            >
              <Card style={{ marginVertical: 6 }}>
                <Card.Content>
                  <ClassDosenItem
                    id={classItem.kelas.id}
                    tipePertemuan={classItem.tipe_pertemuan}
                    namaKelas={classItem.kelas.nama_kelas}
                    ruangan={classItem.ruangan.nama_ruangan}
                    jam={classItem.jam.kode_jam}
                  />
                </Card.Content>
              </Card>
            </Pressable>
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
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    marginBottom: 8,
  },
  filterButtonContent: {
    justifyContent: "flex-start",
  },
  filterInfo: {
    marginTop: 4,
    color: "#666",
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
