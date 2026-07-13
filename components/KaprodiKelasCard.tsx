import { Pressable, StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";

type MatakuliahItem = {
  id: number;
  nama_matkul: string;
  semester: number;
  sks: number;
};

type RekapAbsensi = {
  total_sesi: number;
  hadir: number;
  izin: number;
  sakit: number;
  alfa: number;
};

type KaprodiKelasCardProps = {
  kelas: {
    jadwal_id: number;
    kelas_id: number;
    nama_kelas: string;
    kode_kelas: string;
    dosen: { nama: string };
    matakuliah: MatakuliahItem[];
    rekap_absensi: RekapAbsensi;
  };
  onPress?: () => void;
};

export default function KaprodiKelasCard({
  kelas,
  onPress,
}: KaprodiKelasCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">{kelas.nama_kelas}</Text>
          <Text variant="bodySmall" style={styles.subtitle}>
             Dosen: {kelas.dosen.nama}
          </Text>

          <View style={styles.rekapRow}>
            <Text style={styles.rekapItem}>
              Hadir: {kelas.rekap_absensi.hadir}
            </Text>
            <Text style={styles.rekapItem}>
              Izin: {kelas.rekap_absensi.izin}
            </Text>
            <Text style={styles.rekapItem}>
              Sakit: {kelas.rekap_absensi.sakit}
            </Text>
            <Text style={styles.rekapItem}>
              Alfa: {kelas.rekap_absensi.alfa}
            </Text>
          </View>
          <Text variant="bodySmall" style={styles.totalSesi}>
            Total {kelas.rekap_absensi.total_sesi} sesi tercatat
          </Text>
        </Card.Content>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
  },
  subtitle: {
    color: "#4B5563",
    marginTop: 4,
  },
  rekapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  rekapItem: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    color: "#374151",
    fontSize: 12,
    fontWeight: "600",
  },
  totalSesi: {
    marginTop: 8,
    color: "#6B7280",
  },
});
