import { api } from "../apiConfig";
import { getUserData } from "../auth-context";

/**
 * Daftar kelas absensi aktif
 */
export async function getActiveAttendanceClasses() {
  try {
    const response = await api.get(`/sesi-absensi/aktif`);
    if (response.data.status) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || "Gagal mengambil data absensi, silahkan periksa koneksi internet atau absensi tidak ada yang sedang aktif"
      );
    }
  } catch (error) {
    console.info("Error fetching active attendance classes:", error);
    throw new Error("Gagal mengambil data absensi, silahkan periksa koneksi internet atau absensi tidak ada yang sedang aktif");
  }
}

/**
 * Matakuliah Yang Diampu Dosen
 */
export async function getCoursesByLecturer() {
  const userData = await getUserData();
  try {
    const response = await api.get(`/kelas/dosen/${userData?.nidn}`);
    if (response.data.status) {
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Failed to fetch courses taught by lecturer"
      );
    }
  } catch (error) {
    console.info("Error fetching courses taught by lecturer:", error);
    throw new Error("Failed to fetch courses taught by lecturer");
  }
}
