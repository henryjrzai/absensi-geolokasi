import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type CourseProps = {
  id: number;
  namaKelas: string;
  tipePertemuan: string;
  jadwalId?: number;
  jam?: number;
  ruangan?: number;
  kodeKelas?: string;
  otpCode?: string | null;
  statusAbsensi?: "buka" | "tutup" | null;
  onPress?: () => void;
};
export default function ClassDosenItem(props: CourseProps) {
  return (
    <View>
      <Text variant="labelMedium" style={style.tipePertemuan}>
        {props.tipePertemuan}
      </Text>
      <Text variant="titleMedium">{props.namaKelas}</Text>
      <Text variant="bodyMedium">{`${props.ruangan || 0} | Jam: ${props.jam || 0} | Kode: ${props.kodeKelas || 0}`}</Text>

      {props.statusAbsensi === "buka" && props.otpCode && (
        <View style={style.otpBadge}>
          <Text variant="labelSmall" style={style.otpLabel}>
            KODE OTP
          </Text>
          <Text variant="headlineSmall" style={style.otpValue}>
            {props.otpCode}
          </Text>
        </View>
      )}
    </View>
  );
}

const style = StyleSheet.create({
  tipePertemuan: {
    textTransform: "uppercase",
  },
  otpBadge: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#FFF3CD",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFC107",
    alignItems: "center",
  },
  otpLabel: {
    color: "#856404",
    fontWeight: "bold",
  },
  otpValue: {
    color: "#000",
    fontWeight: "bold",
    letterSpacing: 8,
    marginTop: 4,
  },
});
