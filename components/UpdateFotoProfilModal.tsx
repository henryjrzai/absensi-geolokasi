import { updateFotoProfil } from "@/lib/models/profil";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Modal,
  Portal,
  Text,
} from "react-native-paper";

interface UpdateFotoProfilModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSuccess: (newFotoUrl: string) => void;
}

export default function UpdateFotoProfilModal({
  visible,
  onDismiss,
  onSuccess,
}: UpdateFotoProfilModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Izin akses galeri diperlukan untuk memilih foto profil"
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Izin akses kamera diperlukan untuk mengambil foto profil"
      );
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Silakan pilih foto terlebih dahulu");
      return;
    }

    setLoading(true);
    try {
      console.log("Uploading image:", selectedImage);
      const result = await updateFotoProfil(selectedImage);
      console.log("Upload result:", result);

      if (result.success) {
        Alert.alert(
          "Success",
          result.message || "Foto profil berhasil diupdate"
        );
        onSuccess(result.data.foto);
        handleClose();
      } else {
        Alert.alert("Error", result.message || "Gagal mengupdate foto profil");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      Alert.alert(
        "Error",
        error.message || "Terjadi kesalahan saat mengupdate foto profil"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.modalContainer}
      >
        <Text variant="titleLarge" style={styles.title}>
          Update Foto Profil
        </Text>

        {selectedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.imagePreview}
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={pickImage}
            style={styles.button}
            icon="image"
            disabled={loading}
          >
            Pilih dari Galeri
          </Button>

          <Button
            mode="outlined"
            onPress={takePhoto}
            style={styles.button}
            icon="camera"
            disabled={loading}
          >
            Ambil Foto
          </Button>
        </View>

        {selectedImage && (
          <Button
            mode="contained"
            onPress={handleUpload}
            style={styles.uploadButton}
            icon="upload"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Foto"}
          </Button>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        )}

        <Button
          mode="text"
          onPress={handleClose}
          style={styles.cancelButton}
          disabled={loading}
        >
          Batal
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  imagePreviewContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 10,
  },
  button: {
    marginVertical: 5,
  },
  uploadButton: {
    marginVertical: 10,
  },
  cancelButton: {
    marginTop: 10,
  },
  loadingContainer: {
    marginVertical: 10,
  },
});
