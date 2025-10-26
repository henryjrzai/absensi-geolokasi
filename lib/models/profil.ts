import { API_URL } from "../apiConfig";
import { getToken } from "../auth-context";

interface UpdateFotoProfilResponse {
  success: boolean;
  message: string;
  data: {
    foto: string;
  };
}

export async function updateFotoProfil(
  imageUri: string
): Promise<UpdateFotoProfilResponse> {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Token tidak ditemukan");
    }

    // Create FormData
    const formData = new FormData();

    // Get file info from URI
    const filename = imageUri.split("/").pop() || "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    console.log("Upload details:", {
      filename,
      type,
      uri: imageUri,
      url: `${API_URL}/update-foto-profil`,
    });

    // Append file to FormData
    formData.append("foto", {
      uri: imageUri,
      name: filename,
      type: type,
    } as any);

    const response = await fetch(`${API_URL}/update-foto-profil`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type, let fetch set it automatically with boundary
      },
      body: formData,
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      throw new Error("Server mengembalikan response yang tidak valid");
    }

    const data = await response.json();
    console.log("Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengupdate foto profil");
    }

    return data;
  } catch (error: any) {
    console.error("Error in updateFotoProfil:", error);
    throw new Error(
      error.message || "Terjadi kesalahan saat mengupdate foto profil"
    );
  }
}
