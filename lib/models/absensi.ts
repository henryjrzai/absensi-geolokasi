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

/**
 * fungsional untuk menampilkan detail sesi absensi berdasarkan sesi ID
 * */
export async function getDetailSesiAbsensi(sesiId: number) {
  try {
    const response = await api.get(`/absensi/sesi/${sesiId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching detail sesi absensi:", error);
    throw error;
  }
}

/**
 * fungsional untuk menutup sesi absensi
 * */
export async function tutupSesiAbsensi(sesiId: number) {
  try {
    const response = await api.post(`/sesi-absensi/tutup/${sesiId}`);
    return response.data;
  } catch (error) {
    console.error("Error closing sesi absensi:", error);
    throw error;
  }
}

/**
 * fungsional untuk mendapatkan pengajuan izin/sakit berdasarkan sesi ID
 */
export async function getPengajuanIzinSakitBySesi(sesiId: string) {
  try {
    const response = await api.get(`pengajuan-izin-sakit/sesi/${sesiId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Server merespons dengan status code di luar 2xx
      if (error.response.status === 404) {
        return {
          status: false,
          message:
            error.response.data?.message ||
            "Tidak ada pengajuan izin/sakit pada sesi ini",
          data: [],
        };
      }
      // Error lainnya
      throw {
        status: false,
        message: error.response.data?.message || "Terjadi kesalahan",
        statusCode: error.response.status,
      };
    }
    // Network error atau error lainnya
    throw {
      status: false,
      message: "Gagal terhubung ke server",
    };
  }
}

/**
 * function untuk Membuka sesi absensi
 */
export async function bukaSesiAbsensi(
  jadwalId: number,
  location?: { latitude: number; longitude: number }
) {
  try {
    let payload: any = {
      jadwal_id: jadwalId,
    };

    if (location) {
      payload = {
        ...payload,
        latitude: location.latitude,
        longitude: location.longitude,
      };
    }

    const response = await api.post(`/sesi-absensi/buat`, payload);

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

/**
 * fungsi untuk melakukan validasi pengajuan izin / sakit
 */
export async function validatePengajuanIzinSakit(
  validasi: string,
  pengajuanId: number
) {
  console.log("Validasi:", validasi, "Pengajuan ID:", pengajuanId);
  try {
    const response = await api.put(
      `/pengajuan-izin-sakit/${pengajuanId}/validasi`,
      {
        status_validasi: validasi,
      }
    );
    if (response.data) {
      console.log("Pengajuan izin/sakit berhasil divalidasi");
      return response.data;
    } else {
      return {
        status: false,
        message: "Gagal memvalidasi pengajuan izin/sakit",
      };
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Fungsi untuk mengedit status absensi mahasiswa
 */
export async function editStatusAbsensiMahasiswa(
  sesiId: number,
  mahasiswaId: number,
  status: string
) {
  try {
    const response = await api.put(`/absensi/sesi/${sesiId}/mahasiswa/${mahasiswaId}`, {
      status
    });
    return response.data;
  } catch (error) {
    console.log(error);
  };
}
