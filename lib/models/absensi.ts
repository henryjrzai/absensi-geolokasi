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
export async function submitHadirHandler(sesiId: string) {
  try {
    const response = await api.post(`/sesi-kuliah/hadir`, {
      sesi_kuliah_id: sesiId,
      latitude: null,
      longitude: null,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}