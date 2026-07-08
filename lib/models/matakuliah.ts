import { getUserData } from "@/lib/auth-context";
import { api } from "../apiConfig";
/**
 * Mengambil daftar mata kuliah yang diambil oleh mahasiswa yang sedang login.
 */
export async function getCourseListByStudent() {
  try {
    const response = await api.get(`/kelas/mahasiswa`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAvailableCourses() {
  try {
    const response = await api.get(`/kelas/tersedia`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function registerCourseById(kelasId: number) {
  try {
    const response = await api.post(`/kelas/${kelasId}/daftar`);
    return { success: true, data: response.data };
  } catch (e: any) {
    const errorMessage =
      e.response?.data?.message || "Terjadi kesalahan saat mendaftar";

    return { success: false, message: errorMessage };
  }
}

/**
 * Mendaftarkan diri pada mata kuliah tertentu.
 */
export async function registerCourse(accessCode: string) {
  const userData = await getUserData();

  if (!userData?.npm) {
    throw new Error("NPM tidak ditemukan");
  }

  const data = {
    kode_kelas: accessCode,
    npm:
      typeof userData.npm === "string"
        ? parseInt(userData.npm, 10)
        : userData.npm,
  };

  try {
    const response = await api.post(`/kelas/daftar`, data);

    if (response.data?.success === false) {
      throw new Error(response.data?.message || "Gagal mendaftar mata kuliah.");
    }

    return { success: true, data: response.data };
  } catch (e: any) {
    const errorMessage =
      e.response?.data?.message || "Terjadi kesalahan saat mendaftar";

    return { success: false, message: errorMessage };
  }
}
