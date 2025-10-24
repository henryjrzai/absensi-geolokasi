import { api } from "../apiConfig";

/**
 * Daftar kelas absensi aktif
 */
export async function getActiveAttendanceClasses() {
  try{
    const response = await api.get(`/sesi-absensi/aktif`);
    if (response.data.status) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch active attendance classes");
    }
  } catch (error) {
    console.info("Error fetching active attendance classes:", error);
    throw new Error("Failed to fetch active attendance classes");
  }
}