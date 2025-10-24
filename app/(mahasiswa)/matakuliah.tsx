import { Course } from "@/components/Course";
import { getCourseListByStudent } from "@/lib/models/matakuliah";
import { useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { AnimatedFAB, Card, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Matakuliah() {
  const [courseList, setCourseList] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  const [isExtended, setIsExtended] = useState<boolean>(true);

  const onScroll = ({ nativeEvent }: any) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { paddingHorizontal: 16 }]}>
      <ScrollView
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
      </ScrollView>
      <AnimatedFAB
        icon={"plus"}
        label={"Tambah"}
        extended={true}
        onPress={() => console.log("Pressed")}
        visible={true}
        animateFrom={"right"}
        iconMode={"dynamic"}
        style={[styles.fabStyle, { backgroundColor: theme.colors.primary }]}
        color="white"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: "absolute",
  },
});
