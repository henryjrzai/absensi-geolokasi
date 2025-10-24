import { Course } from "@/components/Course";
import {
  getCourseListByStudent,
  registerCourse,
} from "@/lib/models/matakuliah";
import { useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
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

  const theme = useTheme();

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

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

  const handleAddCourse = async () => {
    const result = await registerCourse(accessCode);
    if (result.success) {
      hideModal();
      setAccessCode("");
      loadCourses();

      setSnackbarMessage("Berhasil mendaftar mata kuliah!");
      setSnackbarVisible(true);
    } else {
      // setError(result.message)
      setSnackbarMessage(result.message || "Gagal mendaftar mata kuliah");
      setSnackbarVisible(true);
      hideModal();
    }
  };

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
          <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
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
        extended={isExtended}
        onPress={showModal}
        visible={true}
        animateFrom={"right"}
        iconMode={"dynamic"}
        style={[styles.fabStyle, { backgroundColor: theme.colors.primary }]}
        color="white"
      />

      {/* Modal for adding new course */}
      <Modal
        visible={modalVisible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modal}
      >
        <Text variant="titleMedium">Masukan Kode Akses Matakuliah</Text>
        <TextInput
          mode="outlined"
          label="Kode Akses"
          placeholder="xxxxxxxxxx"
          onChangeText={setAccessCode}
        />
        <HelperText
          type="info"
          visible={true}
          theme={{ colors: { primary: "green" } }}
        >
          Kode akses dapat diperoleh dari dosen pengampu matakuliah.
        </HelperText>
        <Button icon="plus" mode="elevated" onPress={handleAddCourse}>
          Tambah
        </Button>
      </Modal>
      {/* Modal for adding new course */}

      {/* Snackbar for messages */}
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
    flexGrow: 1,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: "absolute",
  },
  modal: {
    backgroundColor: "white",
    marginHorizontal: 16,
    padding: 20,
  },
});
