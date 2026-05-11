import ClassDosenItem from "@/components/ClassDosenItem";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import { getUserData } from "@/lib/auth-context";
import { getCoursesByLecturer } from "@/lib/models/kelas";
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
  Button,
  Card,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function DosenIndex() {
  const [userData, setUserData] = useState<any>(null);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const theme = useTheme();

  const loadCourses = async () => {
    try {
      const courses = await getCoursesByLecturer();
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
      setLoading(false);
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
      pathname: "/(dosen)/kelas/rekap-absensi",
      params: {
        jadwalId: jadwalId.toString(),
      },
    });
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <HeaderDashboard
        nama={userData?.nama}
        id={userData?.nidn}
        foto={userData?.foto}
      />

      <ScrollView
        style={styles.matakuliahContainer}
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
                DASHBOARD DOSEN
              </Text>
              <Text
                variant="headlineSmall"
                style={[
                  styles.summaryValue,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                {courseList.length} Kelas Aktif
              </Text>
              <Text
                variant="bodyMedium"
                style={[
                  styles.summaryHint,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                Kelola sesi absensi, rekap, dan validasi pengajuan mahasiswa.
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

        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Daftar Mata Kuliah Diampu
          </Text>
          <Button
            mode="text"
            compact
            onPress={() => router.push("/(dosen)/kelas")}
          >
            Lihat Semua
          </Button>
        </View>

        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator size="small" />
            <Text style={styles.stateText}>Memuat daftar kelas...</Text>
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
            <Text style={styles.stateText}>Belum ada mata kuliah yang diampu.</Text>
          </View>
        ) : (
          courseList.slice(0, 8).map((course) => (
            <Pressable
              key={course.jadwal_id}
              onPress={() => handleCoursePress(course.jadwal_id)}
            >
              <Card style={styles.courseCard}>
                <Card.Content>
                  <ClassDosenItem
                    id={course.kelas.id}
                    tipePertemuan={course.tipe_pertemuan}
                    namaKelas={course.kelas.nama_kelas}
                    ruangan={course.ruangan.nama_ruangan}
                    kodeKelas={course.kelas.kode_kelas}
                    jam={course.jam.kode_jam}
                  />
                </Card.Content>
              </Card>
            </Pressable>
          ))
        )}
      </ScrollView>

      {courseList.length > 6 && (
        <Button
          icon="book-open-page-variant"
          mode="contained"
          style={styles.detailButton}
          contentStyle={styles.detailButtonContent}
          onPress={() => router.push("/(dosen)/kelas")}
        >
          Buka Semua Kelas
        </Button>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#F6F8FC",
  },
  matakuliahContainer: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
    borderRadius: 16,
  },
  summaryContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  summaryTextWrap: {
    flex: 1,
  },
  summaryLabel: {
    fontWeight: "700",
    opacity: 0.85,
  },
  summaryValue: {
    fontWeight: "800",
    marginTop: 6,
  },
  summaryHint: {
    marginTop: 8,
    lineHeight: 20,
    opacity: 0.9,
  },
  summaryIconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  detailButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  detailButtonContent: {
    paddingVertical: 6,
  },
});
