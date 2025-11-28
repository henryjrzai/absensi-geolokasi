import {
  bukaSesiAbsensi,
  getSesiAbsensiByJadwalKelas,
} from "@/lib/models/absensi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import {
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
  const [locationDialogVisible, setLocationDialogVisible] =
    useState<boolean>(false);

  const handlerDialog = () => setVisible((v) => !v);
  const handleLocationDialog = () => setLocationDialogVisible((v) => !v);

  const onScroll = ({ nativeEvent }: any) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const theme = useTheme();

  const loadRekapAbsensi = async (jadwalId: number) => {
    try {
      setLoading(true);
      const result = await getSesiAbsensiByJadwalKelas(jadwalId);
      if (result.status) {
        setRekapData(result);
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
    handlerDialog();
    handleLocationDialog();
  };

  const createSession = async (
    location?: { latitude: number; longitude: number } | undefined
  ) => {
    setLoading(true);
    handleLocationDialog();
    try {
      const result = await bukaSesiAbsensi(Number(jadwalId), location);
      if (result.status) {
        await loadRekapAbsensi(Number(jadwalId));
        Alert.alert("Sukses", "Sesi absensi berhasil dibuka.");
      } else {
        setError(result.message || "Gagal membuka sesi absensi.");
        Alert.alert("Error", result.message || "Gagal membuka sesi absensi.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
      Alert.alert("Error", err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSessionWithLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Izin Lokasi Ditolak",
        "Aplikasi memerlukan izin lokasi untuk melanjutkan."
      );
      handleLocationDialog();
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      await createSession({ latitude, longitude });
    } catch (error) {
      Alert.alert(
        "Error Lokasi",
        "Gagal mendapatkan lokasi. Pastikan GPS Anda aktif."
      );
      handleLocationDialog();
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1, padding: 16 }}>
      <ScrollView
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
        {loading && !refreshing ? (
          <Text style={{ textAlign: "center", marginTop: 100 }}>
            Memuat rekap absensi...
          </Text>
        ) : error ? (
          <Text style={{ color: "red", textAlign: "center", marginTop: 100 }}>
            {error}
          </Text>
        ) : !rekapData || !rekapData.sesi_kuliah ? (
          <Text style={{ textAlign: "center", marginTop: 100 }}>
            Tidak ada data rekap absensi.
          </Text>
        ) : (
          <>
            <Text
              variant="titleMedium"
              style={{ marginBottom: 12, fontWeight: "bold" }}
            >
              Riwayat Sesi Absensi
            </Text>
            {rekapData.sesi_kuliah.length === 0 ? (
              <Text>Belum ada sesi kuliah.</Text>
            ) : (
              rekapData.sesi_kuliah.map((item: any, index: number) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    router.push({
                      pathname: "/(dosen)/kelas/detail-absensi",
                      params: { sesiId: item.id },
                    });
                  }}
                >
                  <Card style={{ marginBottom: 12 }}>
                    <Card.Content>
                      <Text
                        variant="titleMedium"
                        style={{ fontWeight: "bold" }}
                      >
                        Pertemuan {rekapData.sesi_kuliah.length - index}
                      </Text>
                      <Text variant="bodyMedium" style={{ marginTop: 4 }}>
                        {item.tanggal_formatted}
                      </Text>
                      <Card
                        style={{
                          marginTop: 8,
                          backgroundColor:
                            item.status_absensi === "buka"
                              ? theme.colors.primary
                              : "#757575",
                          paddingVertical: 4,
                          paddingHorizontal: 12,
                          alignSelf: "flex-start",
                        }}
                      >
                        <Text
                          variant="bodySmall"
                          style={{ color: "white", fontWeight: "bold" }}
                        >
                          {item.status_absensi.toUpperCase()}
                        </Text>
                      </Card>
                      <Text
                        variant="bodySmall"
                        style={{ marginTop: 8, color: "#666" }}
                      >
                        Dibuka: {item.waktu_buka || "-"}
                      </Text>
                      {item.waktu_tutup && (
                        <Text variant="bodySmall" style={{ color: "#666" }}>
                          Ditutup: {item.waktu_tutup}
                        </Text>
                      )}
                      <Card
                        style={{ marginTop: 12, backgroundColor: "#f5f5f5" }}
                      >
                        <Card.Content>
                          <Text
                            variant="bodyMedium"
                            style={{ fontWeight: "bold" }}
                          >
                            Kehadiran
                          </Text>
                          <Text variant="bodySmall">
                            ✅ Hadir: {item.jumlah_hadir}
                          </Text>
                          <Text variant="bodySmall">
                            📝 Izin: {item.jumlah_izin}
                          </Text>
                          <Text variant="bodySmall">
                            🏥 Sakit: {item.jumlah_sakit}
                          </Text>
                          <Text variant="bodySmall">
                            ❌ Alfa: {item.jumlah_alfa}
                          </Text>
                        </Card.Content>
                      </Card>
                    </Card.Content>
                  </Card>
                </Pressable>
              ))
            )}
          </>
        )}
      </ScrollView>

      <AnimatedFAB
        icon={"plus"}
        label={"Tambah Sesi"}
        extended={isExtended}
        visible={true}
        onPress={handlerDialog}
        animateFrom={"right"}
        iconMode={"static"}
        variant={"tertiary"}
        style={styles.fabStyle}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={handlerDialog}>
          <Dialog.Title>Buka Sesi Absensi</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Anda akan membuka sesi absensi untuk matakuliah ini. Silakan
              lanjutkan untuk memulai.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handlerDialog}>Batal</Button>
            <Button
              mode="contained"
              onPress={handleOpenSession}
              style={{ marginLeft: 8 }}
            >
              Lanjutkan
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={locationDialogVisible}
          onDismiss={handleLocationDialog}
        >
          <Dialog.Title>Konfirmasi Lokasi Perkuliahan</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Apakah perkuliahan dilaksanakan di ruangan sesuai jadwal?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={handleCreateSessionWithLocation}
              style={{ marginLeft: 8 }}
            >
              Kelas Pengganti
            </Button>
            <Button mode="contained" onPress={() => createSession()}>Sesuai Jadwal</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fabStyle: {
    position: "absolute",
    right: 16,
    bottom: 16,
    zIndex: 10,
  },
});
