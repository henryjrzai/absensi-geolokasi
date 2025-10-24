import { Course } from "@/components/Course";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import { getUserData, signOut } from "@/lib/auth-context";
import { getCourseListByStudent } from "@/lib/models/matakuliah";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";

export default function MahasiswaIndex() {
  const [userData, setUserData] = useState<any>(null);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const loadUserData = async () => {
      const data = await getUserData();
      setUserData(data);
    };
    loadUserData();

    const loadCourses = async () => {
      try {
        const courses = await getCourseListByStudent();
        if (courses.status) {
          setCourseList(courses.data);
          setLoadingCourses(false);
        } else {
          setError(courses.message || "Gagal memuat daftar mata kuliah.");
          setLoadingCourses(false);
        }
      } catch (error) {
        console.log("Error loading courses:", error);
        setError("Gagal memuat daftar mata kuliah.");
        setLoadingCourses(false);
      }
    };
    loadCourses();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.replace("/auth");
  };

  return (
    <View style={styles.container}>
      <HeaderDashboard nama={userData?.nama} id={userData?.npm} />

      {/* Menu */}
      <View style={styles.menu}>
        <Pressable
          style={[styles.menuItem, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push("/matakuliah")}
        >
          <Entypo name="book" size={24} color="white" />
          <Text style={styles.menuItemText}>Menu Kuliah</Text>
        </Pressable>
        <Pressable
          style={[styles.menuItem, { backgroundColor: theme.colors.primary }]}
        >
          <AntDesign name="schedule" size={24} color="white" />
          <Text style={styles.menuItemText}>Jadwal Kuliah</Text>
        </Pressable>
      </View>
      {/* End Menu */}

      {/* Courses */}
      <View style={{ marginVertical: 8 }}>
        <Text variant="titleSmall">📚 Matakuliah yang sedang diambil</Text>
        {loadingCourses ? (
          <Text>Memuat daftar mata kuliah...</Text>
        ) : error ? (
          <Text style={{ color: "red" }}>{error}</Text>
        ) : courseList.length === 0 ? (
          <Text>Tidak ada mata kuliah yang diambil.</Text>
        ) : null}
        <View>
          {courseList.slice(0, 7).map((course) => (
            <Pressable key={course.id}>
              <Card style={{ marginVertical: 6 }}>
                <Card.Content>
                  <Course
                    id={course.id}
                    namaKelas={course.nama_kelas}
                    tipePertemuan={course.jadwal[0]?.tipe_pertemuan || "N/A"}
                  />
                </Card.Content>
              </Card>
            </Pressable>
          ))}
        </View>
      </View>
      {/* End Courses */}
      
      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        icon="logout"
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "bold",
  },
  userInfo: {
    marginBottom: 24,
    gap: 8,
  },
  logoutButton: {
    marginTop: 16,
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  menuItem: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  menuItemText: {
    color: "white",
    marginTop: 8,
    fontWeight: "bold",
  },
});
