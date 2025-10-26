import { api } from "../apiConfig";

/**
 * Mengambil daftar mata kuliah yang diambil oleh mahasiswa yang sedang login.
 */
export async function getScheduleByStudent() {
  try {
    const response = await api.get(`/jadwal-kelas-mahasiswa`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}