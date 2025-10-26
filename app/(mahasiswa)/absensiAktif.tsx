import AbsensiMapModal from "@/components/AbsensiMapModal";
import { ClassActive } from "@/components/ClassActive";
import { submitHadirHandler } from "@/lib/models/absensi";
import { getActiveAttendanceClasses } from "@/lib/models/kelas";
import { useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function AbsensiAktif() {
  const [activeClasses, setActiveClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedSesiId, setSelectedSesiId] = useState<string | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const theme = useTheme();

  const loadActiveClasses = async () => {
    try {
      setLoading(true);
      const classes = await getActiveAttendanceClasses();
      setActiveClasses(classes);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler functions untuk absensi
  const handleHadir = async (sesiId: string, className: string) => {
    console.log(`Membuka modal absensi untuk sesiId: ${sesiId}`);
    setSelectedSesiId(sesiId);
    setSelectedClassName(className);
    setModalVisible(true);
  };

  const handleSubmitHadir = async (latitude: number, longitude: number) => {
    if (!selectedSesiId) return;

    try {
      const result = await submitHadirHandler(
        selectedSesiId,
        latitude,
        longitude
      );
      console.log("Request payload:", {
        sesiId: selectedSesiId,
        latitude,
        longitude,
      });
      console.info("Response:", result);
      console.log("Absensi berhasil:", result);

      setModalVisible(false);

      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Absensi berhasil dicatat",
      });

      // Refresh data
      await loadActiveClasses();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal melakukan absensi. Silakan coba lagi.";
      Alert.alert("Error", errorMessage);
    }
  };

  const handleIzin = () => {
    console.log("Izin dipilih");
    // Implementasi logika izin
  };

  const handleSakit = () => {
    console.log("Sakit dipilih");
    // Implementasi logika sakit
  };

  useEffect(() => {
    loadActiveClasses();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadActiveClasses();
    setRefreshing(false);
  };

  return (
    <SafeAreaProvider style={styles.container}>
      {loading && (
        <Text variant="bodySmall" style={styles.loadingText}>
          Loading...
        </Text>
      )}
      {error && (
        <Text variant="bodySmall" style={styles.errorText}>
          Error: {error}
        </Text>
      )}
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
        {!loading &&
          !error &&
          activeClasses.length > 0 &&
          activeClasses.map((classItem, index) => (
            <ClassActive
              key={index}
              classes={classItem}
              handlerHadir={() =>
                handleHadir(
                  classItem.jadwal?.sesi?.id,
                  classItem.matakuliah?.nama_matakuliah || "Kelas"
                )
              }
              handlerIzin={handleIzin}
              kelasId={classItem.jadwal?.id}
              sesiId={classItem.jadwal?.sesi?.id}
              handlerSakit={handleSakit}
            />
          ))}
        {!loading && !error && activeClasses.length === 0 && (
          <Text variant="bodySmall" style={styles.loadingText}>
            Tidak ada kelas aktif saat ini
          </Text>
        )}
      </ScrollView>

      <AbsensiMapModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onSubmit={handleSubmitHadir}
        title={selectedClassName}
      />

      <Toast />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  loadingText: {
    marginTop: 20,
    textAlign: "center",
  },
  errorText: {
    marginTop: 20,
    textAlign: "center",
    color: "red",
  },
});
