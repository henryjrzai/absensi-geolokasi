import { Pressable, StyleSheet, View } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";

type CourseProps = {
  key: number;
  classes: {
    matakuliah: {
      nama_matakuliah: string;
    };
    jadwal: {
      tipe_pertemuan: string;
    };
  };
  handlerIzin: () => void;
  handlerHadir: () => void;
  handlerSakit: () => void;
};
export function ClassActive(props: CourseProps) {
  const theme = useTheme();
  return (
    <Pressable key={props.key}>
      <Card style={{ marginVertical: 6 }}>
        <Card.Content>
          <Text variant="labelMedium" style={style.tipePertemuan}>
            {props.classes.jadwal.tipe_pertemuan}
          </Text>
          <Text variant="titleLarge">
            {props.classes.matakuliah.nama_matakuliah}
          </Text>
          <View style={style.buttonContainer}>
            <Button
              icon="check-all"
              mode="outlined"
              onPress={props.handlerHadir}
              style={{ backgroundColor: theme.colors.primary,}}
              textColor="white"
            >
              Hadir
            </Button>
            <Button
              icon="arrow-down-drop-circle-outline"
              mode="outlined"
              onPress={props.handlerIzin}
              style={{ backgroundColor: theme.colors.onSurfaceVariant }}
              textColor="white"
            >
              Izin
            </Button>
            <Button
              icon="hospital-box"
              mode="outlined"
              onPress={props.handlerSakit}
              style={{ backgroundColor: theme.colors.onBackground }}
              textColor="white"
            >
              Sakit
            </Button>
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );
}

const style = StyleSheet.create({
  tipePertemuan: {
    textTransform: "uppercase",
  },
  buttonContainer: { flexDirection: "row", gap: 8, marginTop: 12, justifyContent: "space-around" },
});
