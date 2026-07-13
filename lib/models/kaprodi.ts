import { api } from "../apiConfig";

/**
 * Daftar kelas untuk kaprodi, dengan filter semester opsional
 */
export async function getDaftarKelasKaprodi(semester?: string) {
  try {
    const params = semester ? { semester } : {};
    const response = await api.get(`/kaprodi/kelas`, { params });
    return response.data;
  } catch (error: any) {
    console.info("Error fetching daftar kelas kaprodi:", error);
    if (error?.response?.status === 403) {
      throw new Error("Anda tidak terdaftar sebagai kaprodi.");
    }
    throw new Error("Gagal mengambil daftar kelas kaprodi.");
  }
}
