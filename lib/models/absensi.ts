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

/**
 * fungsional untuk melakukan absensi hadir
 * */
export async function submitHadirHandler(
  sesiId: string,
  latitude: number,
  longitude: number
) {
  try {
    const payload = {
      sesi_kuliah_id: parseInt(sesiId),
      latitude,
      longitude,
    };

    const response = await api.post(`/sesi-absensi/hadir`, payload);
    
    return response.data;
  } catch (error: any) {
    throw error;
  }
}
