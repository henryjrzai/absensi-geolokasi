import { Course } from "@/components/Course";
import {
  getAvailableCourses,
  getCourseListByStudent,
  registerCourseById,
} from "@/lib/models/matakuliah";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Snackbar,
  Text,
  useTheme,
} from "react-native-paper";

type Tab = "diambil" | "tersedia";

export default function Matakuliah() {
  const [activeTab, setActiveTab] = useState<Tab>("diambil");
  const [courseList, setCourseList] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [loadingAvailableCourses, setLoadingAvailableCourses] =
    useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [submittingCourseId, setSubmittingCourseId] = useState<number | null>(
    null
  );

  const theme = useTheme();

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

  const loadAvailableCourses = async () => {
    try {
      const result = await getAvailableCourses();
      if (result.status) {
        setAvailableCourses(result.data);
      }
    } catch (err) {
      console.log("Error loading available courses:", err);
    } finally {
      setLoadingAvailableCourses(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadCourses(), loadAvailableCourses()]);
    setRefreshing(false);
  };

  useEffect(() => {
    loadCourses();
    loadAvailableCourses();
  }, []);

  const handleRegisterAvailableCourse = async (kelasId: number) => {
    setSubmittingCourseId(kelasId);
    const result = await registerCourseById(kelasId);
    setSubmittingCourseId(null);

    if (result.success) {
      await Promise.all([loadCourses(), loadAvailableCourses()]);
      setSnackbarMessage("Berhasil mendaftar kelas.");
      setSnackbarVisible(true);
      return;
    }

    setSnackbarMessage(result.message || "Gagal mendaftar kelas.");
    setSnackbarVisible(true);
  };

  const handleCoursePress = (jadwalId: number) => {
    router.push({
      pathname: "/(mahasiswa)/riwayat-absensi",
      params: { jadwalId: jadwalId.toString() },
    });
  };

  return (
    <View style={styles.container}>
      {/* Tab bar */}
      <View style={[styles.tabBar, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "diambil" && {
              borderBottomColor: theme.colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab("diambil")}
        >
          <Text
            variant="titleSmall"
            style={[
              styles.tabLabel,
              activeTab === "diambil"
                ? { color: theme.colors.primary, fontWeight: "700" }
                : { color: "#888" },
            ]}
          >
            Diambil ({courseList.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "tersedia" && {
              borderBottomColor: theme.colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab("tersedia")}
        >
          <Text
            variant="titleSmall"
            style={[
              styles.tabLabel,
              activeTab === "tersedia"
                ? { color: theme.colors.primary, fontWeight: "700" }
                : { color: "#888" },
            ]}
          >
            Tersedia ({availableCourses.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab content */}
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
        {activeTab === "diambil" && (
          <>
            <View style={styles.sectionHintRow}>
              <MaterialIcons name="touch-app" size={16} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.primary, fontWeight: "700", fontSize: 13 }}>
                Tap untuk detail absensi
              </Text>
            </View>

            {loadingCourses ? (
              <View style={styles.stateCard}>
                <ActivityIndicator size="small" />
                <Text style={styles.stateText}>Memuat daftar mata kuliah...</Text>
              </View>
            ) : error ? (
              <View style={styles.stateCard}>
                <MaterialIcons name="error-outline" size={20} color={theme.colors.error} />
                <Text style={[styles.stateText, { color: theme.colors.error }]}>{error}</Text>
              </View>
            ) : courseList.length === 0 ? (
              <View style={styles.stateCard}>
                <MaterialIcons name="inbox" size={20} color="#777" />
                <Text style={styles.stateText}>Belum ada mata kuliah yang diambil.</Text>
              </View>
            ) : (
              courseList.map((course) => (
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
              ))
            )}
          </>
        )}

        {activeTab === "tersedia" && (
          <>
            {loadingAvailableCourses ? (
              <View style={styles.stateCard}>
                <ActivityIndicator size="small" />
                <Text style={styles.stateText}>Memuat kelas tersedia...</Text>
              </View>
            ) : availableCourses.length === 0 ? (
              <View style={styles.stateCard}>
                <MaterialIcons name="inbox" size={20} color="#777" />
                <Text style={styles.stateText}>Tidak ada kelas tersedia.</Text>
              </View>
            ) : (
              availableCourses.map((course) => (
                <Card style={styles.availableCourseCard} key={course.id}>
                  <Card.Content>
                    <Text variant="titleMedium" style={styles.availableCourseTitle}>
                      {course.nama_kelas}
                    </Text>
                    <Text variant="bodyMedium">Dosen: {course.dosen?.nama || "-"}</Text>
                    <Text variant="bodyMedium">
                      Prodi: {course.prodi?.nama_prodi || "-"}
                    </Text>
                    {course.jadwal?.length > 0 && (
                      <View style={styles.scheduleList}>
                        {course.jadwal.map((jadwal: any) => (
                          <Text
                            key={jadwal.id}
                            variant="bodySmall"
                            style={styles.scheduleText}
                          >
                            {jadwal.hari} •{" "}
                            {jadwal.jam?.jam_mulai?.slice(0, 5)} -{" "}
                            {jadwal.jam?.jam_selesai?.slice(0, 5)} •{" "}
                            {jadwal.ruangan?.nama_ruangan || "-"}
                          </Text>
                        ))}
                      </View>
                    )}
                    <Button
                      mode={course.sudah_terdaftar ? "outlined" : "contained"}
                      disabled={
                        course.sudah_terdaftar || submittingCourseId === course.id
                      }
                      loading={submittingCourseId === course.id}
                      onPress={() => handleRegisterAvailableCourse(course.id)}
                      style={styles.registerButton}
                    >
                      {course.sudah_terdaftar ? "Sudah Terdaftar" : "Daftar"}
                    </Button>
                  </Card.Content>
                </Card>
              ))
            )}
          </>
        )}
      </ScrollView>

      {/* Tombol tambah kelas lama pakai kode akses. Disimpan sementara untuk rollback.
      <AnimatedFAB ... />
      */}

      {/* Modal tambah kelas lama pakai kode akses. Disimpan sementara untuk rollback.
      <Modal ...>...</Modal>
      */}

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FC",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 14,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionHintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 10,
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
  availableCourseCard: {
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: "white",
  },
  availableCourseTitle: {
    fontWeight: "700",
    marginBottom: 6,
  },
  scheduleList: {
    marginTop: 8,
    gap: 4,
  },
  scheduleText: {
    color: "#555",
  },
  registerButton: {
    marginTop: 12,
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
