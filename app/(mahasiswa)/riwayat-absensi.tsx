import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function RiwayatAbsensi() {
  const { jadwalId } = useLocalSearchParams();
  const [courseDetail, setCourseDetail] = useState<any>(null);

  // useEffect(() => {
  //   // Gunakan jadwalId untuk API call
  //   const fetchCourseDetail = async () => {
  //     try {
  //       // Contoh API call dengan id
  //       const response = await api.get(`/jadwal/${jadwalId}`);
  //       setCourseDetail(response.data);
  //     } catch (error) {
  //       console.log("Error fetching course detail:", error);
  //     }
  //   };

  //   if (courseId && jadwalId) {
  //     fetchCourseDetail();
  //   }
  // }, [courseId, jadwalId]);

  return (
    <View style={{ padding: 16 }}>
      <Text variant="headlineSmall">Detail Matakuliah</Text>
      <Text>Jadwal ID: {jadwalId}</Text>
      {/* Render detail course data */}
    </View>
  );
}
