import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type CourseProps = {
  id: number;
  namaKelas: string;
  tipePertemuan: string;
  hari: string;
  kodeJam: string;
  ruangan: string;
  jamMulai: string;
  jamSelesai: string;
};
export function JadwalItem(props: CourseProps) {
  return (
    <View>
      <Text variant="labelMedium" style={style.tipePertemuan}>
        {props.hari}/{props.kodeJam} ({formatJam(props.jamMulai)} - {formatJam(props.jamSelesai)})
      </Text>
      <Text variant="titleMedium">{props.namaKelas} / {props.tipePertemuan}</Text>
      <Text variant="bodyMedium">{`Ruangan : ${props.ruangan}`}</Text>
    </View>
  );
}

function formatJam(jam: string) {
  return jam.slice(0, 5);
}

const style = StyleSheet.create({
  tipePertemuan: {
    textTransform: "uppercase",
  },
});
