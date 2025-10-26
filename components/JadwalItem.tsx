import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type CourseProps = {
  id: number;
  namaKelas: string;
  tipePertemuan: string;
  hari: string;
  kodeJam: string;
  ruangan: string;
};
export function JadwalItem(props: CourseProps) {
  return (
    <View>
      <Text variant="labelMedium" style={style.tipePertemuan}>
        {props.hari}/{props.kodeJam}
      </Text>
      <Text variant="titleMedium">{props.namaKelas} / {props.tipePertemuan}</Text>
      <Text variant="bodyMedium">{`Ruangan : ${props.ruangan}`}</Text>
    </View>
  );
}

const style = StyleSheet.create({
  tipePertemuan: {
    textTransform: "uppercase",
  },
});
