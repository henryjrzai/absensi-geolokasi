import { api } from "../apiConfig";

export async function getRiwayatAbsensiByJadwal(jadwalId: number) {
  try {
    const response = await api.get(`/sesi-absensi/${jadwalId}/riwayat`);
    return response.data;
  } catch (error) {
    console.error("Error fetching riwayat absensi:", error);
    throw error;
  }
}
