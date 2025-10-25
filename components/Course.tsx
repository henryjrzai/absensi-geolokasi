import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type CourseProps = {
  id: number;
  namaKelas: string;
  tipePertemuan: string;
  jadwalId?: number;
  persentase?: number;
  onPress?: () => void;
};
export function Course(props: CourseProps) {
  return (
    <View>
      <Text variant="labelMedium" style={style.tipePertemuan}>
        {props.tipePertemuan}
      </Text>
      <Text variant="titleMedium">{props.namaKelas}</Text>
      <Text variant="bodyMedium">Kehadiran {props.persentase || 0}</Text>
    </View>
  );
}

const style = StyleSheet.create({
  tipePertemuan: {
    textTransform: "uppercase",
  },
});
