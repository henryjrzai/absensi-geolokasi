import { getSesiAbsensiByJadwalKelas } from "@/lib/models/absensi";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { Card, Text } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RekapAbsensi() {
  const { jadwalId } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [rekapData, setRekapData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const loadRekapAbsensi = async (jadwalId: number) => {
    try {
      const result = await getSesiAbsensiByJadwalKelas(jadwalId);
      if (result.status) {
        setRekapData(result);
      } else {
        setError(result.message || "Gagal memuat rekap absensi.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jadwalId) {
      loadRekapAbsensi(Number(jadwalId));
    }
  }, [jadwalId]);

  return (
    <SafeAreaProvider style={{ flex: 1, padding: 16 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text>Memuat rekap absensi...</Text>
        ) : error ? (
          <Text style={{ color: "red" }}>{error}</Text>
        ) : !rekapData || !rekapData.sesi_kuliah ? (
          <Text>Tidak ada data rekap absensi.</Text>
        ) : (
          <>

            {/* Daftar Sesi Kuliah */}
            <Text
              variant="titleMedium"
              style={{ marginBottom: 12, fontWeight: "bold" }}
            >
              Riwayat Sesi Absensi
            </Text>
            {rekapData.sesi_kuliah.length === 0 ? (
              <Text>Belum ada sesi kuliah.</Text>
            ) : (
              rekapData.sesi_kuliah.map((item: any, index: number) => (
                <Pressable key={item.id}>
                  <Card style={{ marginBottom: 12 }}>
                    <Card.Content>
                      <Text
                        variant="titleMedium"
                        style={{ fontWeight: "bold" }}
                      >
                        Pertemuan {rekapData.sesi_kuliah.length - index}
                      </Text>
                      <Text variant="bodyMedium" style={{ marginTop: 4 }}>
                        {item.tanggal_formatted}
                      </Text>

                      {/* Badge Status Absensi */}
                      <Card
                        style={{
                          marginTop: 8,
                          backgroundColor:
                            item.status_absensi === "buka"
                              ? "#4CAF50"
                              : "#757575",
                          paddingVertical: 4,
                          paddingHorizontal: 12,
                          alignSelf: "flex-start",
                        }}
                      >
                        <Text
                          variant="bodySmall"
                          style={{ color: "white", fontWeight: "bold" }}
                        >
                          {item.status_absensi === "buka" ? "BUKA" : "TUTUP"}
                        </Text>
                      </Card>

                      {/* Info Waktu */}
                      <Text
                        variant="bodySmall"
                        style={{ marginTop: 8, color: "#666" }}
                      >
                        Dibuka: {item.waktu_buka || "-"}
                      </Text>
                      {item.waktu_tutup && (
                        <Text variant="bodySmall" style={{ color: "#666" }}>
                          Ditutup: {item.waktu_tutup}
                        </Text>
                      )}

                      {/* Statistik Kehadiran */}
                      <Card
                        style={{ marginTop: 12, backgroundColor: "#f5f5f5" }}
                      >
                        <Card.Content>
                          <Text
                            variant="bodyMedium"
                            style={{ fontWeight: "bold" }}
                          >
                            Kehadiran
                          </Text>
                          <Text variant="bodySmall">
                            ✅ Hadir: {item.jumlah_hadir}
                          </Text>
                          <Text variant="bodySmall">
                            📝 Izin: {item.jumlah_izin}
                          </Text>
                          <Text variant="bodySmall">
                            🏥 Sakit: {item.jumlah_sakit}
                          </Text>
                          <Text variant="bodySmall">
                            ❌ Alfa: {item.jumlah_alfa}
                          </Text>
                        </Card.Content>
                      </Card>
                    </Card.Content>
                  </Card>
                </Pressable>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
}
