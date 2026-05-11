import { Course } from "@/components/Course";
import { getCourseListByStudent, registerCourse } from "@/lib/models/matakuliah";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  ActivityIndicator,
  AnimatedFAB,
  Button,
  Card,
  HelperText,
  Modal,
  Snackbar,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Matakuliah() {
  const [courseList, setCourseList] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [accessCode, setAccessCode] = useState<string>("");
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [isExtended, setIsExtended] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const theme = useTheme();

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const loadCourses = async () => {
    try {
      const courses = await getCourseListByStudent();
      if (courses.status) {
        setCourseList(courses.data);
        setError(null);
      } else {
        setError(courses.message || "Gagal memuat daftar mata kuliah.");
      }
    } catch (err) {
      console.log("Error loading courses:", err);
      setError("Gagal memuat daftar mata kuliah.");
    } finally {
      setLoadingCourses(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  const onScroll = ({ nativeEvent }: any) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleAddCourse = async () => {
    if (!accessCode.trim()) {
      setSnackbarMessage("Kode akses tidak boleh kosong.");
      setSnackbarVisible(true);
      return;
    }

    setSubmitting(true);
    const result = await registerCourse(accessCode.trim());
    setSubmitting(false);

    if (result.success) {
      hideModal();
      setAccessCode("");
      await loadCourses();
      setSnackbarMessage("Berhasil mendaftar mata kuliah.");
      setSnackbarVisible(true);
      return;
    }

    setSnackbarMessage(result.message || "Gagal mendaftar mata kuliah.");
    setSnackbarVisible(true);
  };

  const handleCoursePress = (jadwalId: number) => {
    router.push({
      pathname: "/(mahasiswa)/riwayat-absensi",
      params: {
        jadwalId: jadwalId.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
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
            Daftar Matakuliah
          </Text>
          <View style={styles.sectionHint}>
            <MaterialIcons name="touch-app" size={16} color={theme.colors.primary} />
            <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>
              Tap untuk detail
            </Text>
          </View>
        </View>

        {loadingCourses ? (
          <View style={styles.stateCard}>
            <ActivityIndicator size="small" />
            <Text style={styles.stateText}>Memuat daftar mata kuliah...</Text>
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
        ) : courseList.length === 0 ? (
          <View style={styles.stateCard}>
            <MaterialIcons name="inbox" size={20} color="#777" />
            <Text style={styles.stateText}>Belum ada mata kuliah yang diambil.</Text>
          </View>
        ) : (
          <View>
            {courseList.map((course) => (
              <Pressable
                key={course.jadwal_id}
                onPress={() => handleCoursePress(course.jadwal_id)}
              >
                <Card style={styles.courseCard}>
                  <Card.Content>
                    <Course
                      id={course.kelas.id}
                      namaKelas={course.kelas.nama_kelas}
                      tipePertemuan={course.tipe_pertemuan || "N/A"}
                      jadwalId={course.jadwal_id}
                      persentase={course.statistik_absensi.presentase_kehadiran}
                    />
                  </Card.Content>
                </Card>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      <AnimatedFAB
        icon="plus"
        label="Tambah Kelas"
        extended={isExtended}
        onPress={showModal}
        visible
        animateFrom="right"
        iconMode="dynamic"
        style={[styles.fabStyle, { backgroundColor: theme.colors.primary }]}
        color="white"
      />

      <Modal
        visible={modalVisible}
        onDismiss={hideModal}
        contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
      >
        <Text variant="titleMedium" style={styles.modalTitle}>
          Tambah Matakuliah
        </Text>
        <Text variant="bodySmall" style={styles.modalSubtitle}>
          Masukkan kode akses dari dosen pengampu.
        </Text>
        <TextInput
          mode="outlined"
          label="Kode Akses"
          placeholder="Contoh: IFKOM-2026-A"
          value={accessCode}
          onChangeText={setAccessCode}
          autoCapitalize="characters"
          style={styles.input}
        />
        <HelperText type="info" visible>
          Kode akses dapat diperoleh dari dosen pengampu matakuliah.
        </HelperText>
        <View style={styles.modalActions}>
          <Button mode="text" onPress={hideModal}>
            Batal
          </Button>
          <Button
            icon="plus"
            mode="contained"
            onPress={handleAddCourse}
            loading={submitting}
            disabled={submitting}
          >
            Tambah
          </Button>
        </View>
      </Modal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "Tutup",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FC",
  },
  content: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 100,
  },
  infoCard: {
    borderRadius: 16,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: "700",
  },
  sectionHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
  courseCard: {
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: "white",
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: "absolute",
  },
  modal: {
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    fontWeight: "700",
  },
  modalSubtitle: {
    marginTop: 6,
    opacity: 0.85,
  },
  input: {
    marginTop: 14,
  },
  modalActions: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
});
