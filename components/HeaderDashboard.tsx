import { StyleSheet, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";

type HeaderDashboardProps = {
  nama?: string | null;
  id?: string | number | null;
  foto?: string | null;
  role?: string | null;
};

export function HeaderDashboard(props: HeaderDashboardProps) {
  const theme = useTheme();

  const displayName = props.nama?.trim() || "Pengguna";
  const displayId = props.id ? String(props.id) : "-";
  const displayRole = props.role?.trim() || "Pengguna Aplikasi";

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 11
      ? "Selamat Pagi"
      : hour < 15
      ? "Selamat Siang"
      : hour < 18
      ? "Selamat Sore"
      : "Selamat Malam";
  const formattedDate = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <View
        style={[
          styles.accentBar,
          { backgroundColor: theme.colors.tertiary },
        ]}
      />
      <View style={styles.textWrap}>
        <Text
          variant="labelLarge"
          style={[styles.welcome, { color: theme.colors.onSurfaceVariant }]}
        >
          {greeting}
        </Text>
        <Text
          variant="titleLarge"
          numberOfLines={1}
          style={[styles.nama, { color: theme.colors.onSurface }]}
        >
          {displayName}
        </Text>
        <Text
          variant="bodySmall"
          style={[styles.userId, { color: theme.colors.onSurfaceVariant }]}
        >
          ID: {displayId}
        </Text>
        <Text
          variant="bodySmall"
          numberOfLines={1}
          style={[styles.dateText, { color: theme.colors.onSurfaceVariant }]}
        >
          {formattedDate}
        </Text>
      </View>

      <View style={styles.rightColumn}>
        <View
          style={[
            styles.avatarWrap,
            { backgroundColor: theme.colors.secondaryContainer },
          ]}
        >
          <Avatar.Icon
            size={62}
            icon="account"
            color={theme.colors.onSecondaryContainer}
            style={{ backgroundColor: "transparent" }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  textWrap: {
    flex: 1,
    paddingRight: 14,
    paddingLeft: 8,
  },
  accentBar: {
    width: 6,
    alignSelf: "stretch",
    borderRadius: 999,
  },
  welcome: {
    letterSpacing: 0.2,
    opacity: 0.95,
  },
  nama: {
    marginTop: 4,
    fontWeight: "700",
  },
  userId: {
    marginTop: 4,
    opacity: 0.95,
  },
  metaRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 8,
  },
  metaBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  dateText: {
    marginTop: 10,
    opacity: 0.95,
  },
  rightColumn: {
    alignItems: "center",
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  loginInfo: {
    marginTop: 6,
    fontWeight: "600",
  },
});
