import { Course } from "@/components/Course";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import { getUserData } from "@/lib/auth-context";
import { getCourseListByStudent } from "@/lib/models/matakuliah";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
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
import { ActivityIndicator, Card, Text, useTheme } from "react-native-paper";

export default function MahasiswaIndex() {
  const [userData, setUserData] = useState<any>(null);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
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

  useEffect(() => {
    const loadUserData = async () => {
      const data = await getUserData();
      setUserData(data);
    };

    loadUserData();
    loadCourses();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
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
    <View style={styles.container}>
      <HeaderDashboard
        nama={userData?.nama}
        id={userData?.npm}
        foto={userData?.foto}
        role="Mahasiswa"
      />

      <ScrollView
        style={styles.scrollArea}
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
        <Card
          style={[
            styles.summaryCard,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <Card.Content style={styles.summaryContent}>
            <View style={styles.summaryTextWrap}>
              <Text
                variant="labelLarge"
                style={[
                  styles.summaryLabel,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                AKADEMIK SEMESTER BERJALAN
              </Text>
              <Text
                variant="headlineSmall"
                style={[
                  styles.summaryValue,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                {courseList.length} Mata Kuliah
              </Text>
              <Text
                variant="bodyMedium"
                style={[
                  styles.summaryHint,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                Pantau kehadiranmu dan cek riwayat absensi setiap pertemuan.
              </Text>
            </View>
            <View
              style={[
                styles.summaryIconBox,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <MaterialIcons
                name="school"
                size={28}
                color={theme.colors.onPrimary}
              />
            </View>
          </Card.Content>
        </Card>

        <View style={styles.menuRow}>
          <Pressable
            style={[styles.menuCard, { backgroundColor: "#0F766E" }]}
            onPress={() => router.push("/(mahasiswa)/matakuliah")}
          >
            <Entypo name="book" size={24} color="white" />
            <Text style={styles.menuTitle}>Matakuliah</Text>
            <Text style={styles.menuSubtitle}>Lihat daftar kelasmu</Text>
          </Pressable>

          <Pressable
            style={[styles.menuCard, { backgroundColor: "#1D4ED8" }]}
            onPress={() => router.push("/(mahasiswa)/jadwal")}
          >
            <AntDesign name="schedule" size={24} color="white" />
            <Text style={styles.menuTitle}>Jadwal Kuliah</Text>
            <Text style={styles.menuSubtitle}>Atur ritme perkuliahan</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Matakuliah Yang Diambil
          </Text>
          <Pressable onPress={() => router.push("/(mahasiswa)/matakuliah")}>
            <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>
              Lihat Semua
            </Text>
          </Pressable>
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
            <Text style={styles.stateText}>
              Tidak ada mata kuliah yang sedang diambil.
            </Text>
          </View>
        ) : (
          <View>
            {courseList.slice(0, 7).map((course) => (
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FC",
    paddingTop: 8,
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summaryCard: {
    borderRadius: 16,
    marginBottom: 14,
  },
  summaryContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  summaryTextWrap: {
    flex: 1,
  },
  summaryLabel: {
    fontWeight: "700",
    opacity: 0.9,
  },
  summaryValue: {
    marginTop: 6,
    fontWeight: "800",
  },
  summaryHint: {
    marginTop: 8,
    lineHeight: 20,
    opacity: 0.9,
  },
  summaryIconBox: {
    width: 54,
    height: 54,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  menuCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
  },
  menuTitle: {
    marginTop: 8,
    color: "white",
    fontWeight: "800",
    fontSize: 15,
  },
  menuSubtitle: {
    marginTop: 4,
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
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
  courseCard: {
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: "white",
  },
});
