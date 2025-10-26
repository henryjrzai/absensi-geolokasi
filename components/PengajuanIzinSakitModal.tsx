import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import {
  Button,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

interface PengajuanIzinSakitModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (file: any, keterangan: string, status: "izin" | "sakit") => void;
  title: string;
  status: "izin" | "sakit";
}

export default function PengajuanIzinSakitModal({
  visible,
  onDismiss,
  onSubmit,
  title,
  status,
}: PengajuanIzinSakitModalProps) {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [keterangan, setKeterangan] = useState<string>("");

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Denied",
          "Izinkan aplikasi untuk mengakses galeri foto Anda"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedFile({
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          type: asset.mimeType || "image/jpeg",
          size: asset.fileSize,
        });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Gagal memilih gambar");
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      Alert.alert("Perhatian", "Silakan pilih file bukti terlebih dahulu");
      return;
    }

    if (!keterangan.trim()) {
      Alert.alert("Perhatian", "Silakan isi keterangan terlebih dahulu");
      return;
    }

    onSubmit(selectedFile, keterangan, status);
    // Reset state
    setSelectedFile(null);
    setKeterangan("");
  };

  const handleDismiss = () => {
    setSelectedFile(null);
    setKeterangan("");
    onDismiss();
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            Pengajuan {status === "izin" ? "Izin" : "Sakit"}
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {title}
          </Text>
        </View>

        <View style={styles.content}>
          <Text variant="bodyMedium" style={styles.label}>
            Keterangan
          </Text>
          <TextInput
            mode="outlined"
            placeholder="Masukkan keterangan"
            value={keterangan}
            onChangeText={setKeterangan}
            multiline
            numberOfLines={3}
            style={styles.textInput}
          />

          <Text variant="bodyMedium" style={[styles.label, { marginTop: 16 }]}>
            Upload File
          </Text>
          <Text variant="bodySmall" style={styles.helperText}>
            file jpg, png & jpeg
          </Text>

          {selectedFile ? (
            <View style={styles.filePreviewContainer}>
              {selectedFile.type.startsWith("image/") ? (
                <Image
                  source={{ uri: selectedFile.uri }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.filePlaceholder}>
                  <Feather name="file" size={40} color={theme.colors.primary} />
                  <Text variant="bodySmall" style={{ marginTop: 8 }}>
                    {selectedFile.name}
                  </Text>
                </View>
              )}
              <IconButton
                icon="close-circle"
                size={24}
                iconColor={theme.colors.error}
                style={styles.removeButton}
                onPress={removeFile}
              />
            </View>
          ) : (
            <Button
              mode="outlined"
              onPress={pickImage}
              style={styles.uploadButton}
              icon="upload"
            >
              Pilih File
            </Button>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={handleDismiss}
            style={[styles.actionButton, { flex: 1 }]}
          >
            BATAL
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!selectedFile}
            style={[styles.actionButton, { flex: 1 }]}
          >
            AJUKAN
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
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  content: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
  },
  helperText: {
    opacity: 0.6,
    marginBottom: 12,
  },
  textInput: {
    marginBottom: 8,
  },
  uploadButton: {
    borderRadius: 8,
    borderStyle: "dashed",
    paddingVertical: 20,
  },
  filePreviewContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    backgroundColor: "#f5f5f5",
  },
  filePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    borderRadius: 8,
  },
});
