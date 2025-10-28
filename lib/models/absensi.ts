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

/**
 * fungsional untuk melakukan pengajuan izin/sakit
 * */
export async function submitIzinSakitHandler(
  kelasId: string,
  sesiId: string,
  status: "izin" | "sakit",
  keterangan: string,
  file: any
) {
  try {
    const formData = new FormData();
    formData.append("kelasId", kelasId);
    formData.append("sesiId", sesiId);
    formData.append("status", status);
    formData.append("keterangan", keterangan);

    // Append file
    const fileToUpload: any = {
      uri: file.uri,
      type: file.type,
      name: file.name,
    };
    formData.append("bukti_file", fileToUpload);

    const response = await api.post(
      `/kelas/${kelasId}/sesi-absensi/${sesiId}/pengajuan-izin-sakit`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    // console.error("Error submitting izin/sakit:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
}

/**
 * fungsional untuk menampilkan sesi absensi berdasarkan jadwal dan kelas
 * */
export async function getSesiAbsensiByJadwalKelas(jadwalId: number) {
  try {
    const response = await api.get(`/absensi/kelas/${jadwalId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sesi absensi:", error);
    throw error;
  }
}