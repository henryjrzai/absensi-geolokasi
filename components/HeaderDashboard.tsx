import { StyleSheet, View } from "react-native";
import { Avatar, Text } from "react-native-paper";

type HeaderDashboardProps = {
  nama: string;
  id: string;
  foto: string;
};

export function HeaderDashboard(props: HeaderDashboardProps) {
  const getAvatarSource = () => {
    if (props.foto) {
      return { uri: props.foto };
    }
    return require("../assets/images/logo.png");
  };
  return (
    <View style={styles.container}>
      <View>
        <Text variant="bodyLarge">👋 Selamat Datang</Text>
        <Text variant="titleSmall" style={styles.nama}>{props.nama}</Text>
        <Text variant="bodySmall">{props.id}</Text>
      </View>
      <View>
        <Avatar.Image size={64} source={getAvatarSource()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginTop: 16,
  },
  nama: {
    fontWeight: "bold",
  }
});
