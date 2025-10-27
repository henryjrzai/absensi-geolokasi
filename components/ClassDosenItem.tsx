import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type CourseProps = {
  id: number;
  namaKelas: string;
  tipePertemuan: string;
  jadwalId?: number;
  jam?: number;
  ruangan?: number;
  onPress?: () => void;
};
export default function ClassDosenItem(props: CourseProps) {
  return (
    <View>
      <Text variant="labelMedium" style={style.tipePertemuan}>
        {props.tipePertemuan}
      </Text>
      <Text variant="titleMedium">{props.namaKelas}</Text>
      <Text variant="bodyMedium">{`${props.ruangan || 0} | Jam: ${props.jam || 0}`}</Text>
    </View>
  );
}

const style = StyleSheet.create({
  tipePertemuan: {
    textTransform: "uppercase",
  },
});
