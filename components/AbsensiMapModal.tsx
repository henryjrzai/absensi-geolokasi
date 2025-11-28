import Feather from "@expo/vector-icons/Feather";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text, useTheme } from "react-native-paper";
import { WebView } from "react-native-webview";

interface AbsensiMapModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (latitude: number, longitude: number) => void;
  title: string;
}

export default function AbsensiMapModal({
  visible,
  onDismiss,
  onSubmit,
  title,
}: AbsensiMapModalProps) {
  const theme = useTheme();
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      getLocation();
    }
  }, [visible]);

  const getLocation = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        Alert.alert(
          "Permission Denied",
          "Izinkan aplikasi untuk mengakses lokasi Anda"
        );
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error getting location:", error);
      setErrorMsg("Gagal mendapatkan lokasi");
      setLoading(false);
      Alert.alert("Error", "Gagal mendapatkan lokasi perangkat");
    }
  };

  const handleSubmit = () => {
    if (location) {
      onSubmit(location.latitude, location.longitude);
    } else {
      Alert.alert("Error", "Lokasi belum tersedia");
    }
  };

  const getMapHtml = (lat: number, lon: number) => `
    <!DOCTYPE html>
    <html>
    <head>
      <title>OpenStreetMap</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
      <style>
        html, body, #map {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${lat}, ${lon}], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        var marker = L.marker([${lat}, ${lon}]).addTo(map);
        marker.bindPopup("<b>Lokasi Anda</b><br>Anda berada di sini.").openPopup();
      </script>
    </body>
    </html>
  `;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            {title}
          </Text>
        </View>

        <View style={styles.mapContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={{ marginTop: 10 }}>Mendapatkan lokasi...</Text>
            </View>
          ) : errorMsg ? (
            <View style={styles.errorContainer}>
              <Text style={{ color: theme.colors.error }}>{errorMsg}</Text>
              <Button
                mode="contained"
                onPress={getLocation}
                style={{ marginTop: 10 }}
              >
                Coba Lagi
              </Button>
            </View>
          ) : location ? (
            <WebView
              originWhitelist={["*"]}
              source={{ html: getMapHtml(location.latitude, location.longitude) }}
              style={styles.map}
            />
          ) : null}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!location || loading}
            labelStyle={styles.buttonLabel}
            icon={() => <Feather name="map-pin" size={20} color="white" />}
          >
            HADIR
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    borderRadius: 12,
    maxHeight: "90%",
  },
  header: {
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontWeight: "bold",
  },
  mapContainer: {
    height: 400,
    width: "100%",
    overflow: "hidden",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  buttonContainer: {
    padding: 20,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
