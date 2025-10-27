import ClassDosenItem from "@/components/ClassDosenItem";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import { getUserData, signOut } from "@/lib/auth-context";
import { getCoursesByLecturer } from "@/lib/models/kelas";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";
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
        setLoading(false);
      } else {
        setError(courses.message || "Gagal memuat daftar mata kuliah.");
        setLoading(false);
      }
    } catch (error) {
      console.log("Error loading courses:", error);
      setError("Gagal memuat daftar mata kuliah.");
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

  return (
    <SafeAreaProvider style={styles.container}>
      <HeaderDashboard
        nama={userData?.nama}
        id={userData?.nidn}
        foto={userData?.foto}
      />
      <ScrollView style={styles.matakuliahContainer}>
        <Text variant="titleSmall">📚 Matakuliah yang di ajar</Text>
        {loading ? (
          <Text>Memuat daftar mata kuliah...</Text>
        ) : error ? (
          <Text style={{ color: "red" }}>{error}</Text>
        ) : courseList.length === 0 ? (
          <Text>Tidak ada mata kuliah yang diambil.</Text>
        ) : null}

        {/* Render daftar mata kuliah */}
        {courseList.map((course) => (
          <Pressable key={course.jadwal_id}>
            <Card style={{ marginVertical: 6 }}>
              <Card.Content>
                <ClassDosenItem
                  id={course.kelas.id}
                  tipePertemuan={course.tipe_pertemuan}
                  namaKelas={course.kelas.nama_kelas}
                  ruangan={course.ruangan.nama_ruangan}
                  jam={course.jam.kode_jam}
                />
              </Card.Content>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
      <Button icon="alpha-i-circle" mode="contained" style={{ margin: 16 }}>
        LIHAT DETAIL . . .
      </Button>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },
  matakuliahContainer: {
    flex: 1,
    padding: 16,
  },
});
