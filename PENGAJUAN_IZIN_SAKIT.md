# Dokumentasi Fitur Pengajuan Izin/Sakit

## 📋 Overview

Fitur untuk mengajukan izin atau sakit dengan upload bukti file (jpg, png, jpeg).

## 🎯 Fitur yang Diimplementasikan

### 1. Modal Pengajuan

- ✅ Input keterangan (multiline TextInput)
- ✅ Pilih file dari galeri
- ✅ Preview gambar sebelum upload
- ✅ Hapus file yang sudah dipilih
- ✅ Validasi keterangan required
- ✅ Validasi file required (hanya jpg, png, jpeg)
- ✅ Button BATAL dan AJUKAN

### 2. Upload File

- ✅ Menggunakan `expo-image-picker`
- ✅ Kompresi gambar (quality: 0.8)
- ✅ Aspect ratio 4:3
- ✅ Request permission galeri otomatis

### 3. Submit ke API

- ✅ Endpoint: `/kelas/{kelasId}/sesi-absensi/{sesiId}/pengajuan-izin-sakit`
- ✅ Method: POST
- ✅ Content-Type: `multipart/form-data`
- ✅ Body Parameters:
  - `kelasId` (string)
  - `sesiId` (string)
  - `status` ("izin" | "sakit")
  - `keterangan` (string) - **Required**
  - `bukti_file` (file)

## 📱 User Flow

1. User klik tombol **IZIN** atau **SAKIT** pada kelas aktif
2. Modal pengajuan muncul dengan judul mata kuliah
3. User mengisi **keterangan** di text field
4. User klik **"Pilih File"**
5. Permission galeri diminta (jika belum)
6. User memilih gambar dari galeri
7. Preview gambar ditampilkan
8. User bisa hapus dan pilih ulang file
9. User klik **"AJUKAN"**
10. Validasi: keterangan & file harus terisi
11. File & keterangan di-upload ke server dengan FormData
12. Notifikasi sukses/error ditampilkan
13. Data kelas di-refresh otomatis

## 🔧 Komponen

### `PengajuanIzinSakitModal.tsx`

Props:

```typescript
interface PengajuanIzinSakitModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (file: any, keterangan: string, status: "izin" | "sakit") => void;
  title: string;
  status: "izin" | "sakit";
}
```

### `submitIzinSakitHandler()` di `absensi.ts`

```typescript
export async function submitIzinSakitHandler(
  kelasId: string,
  sesiId: string,
  status: "izin" | "sakit",
  keterangan: string,
  file: any
);
```

## 📝 Cara Penggunaan

### Di `absensiAktif.tsx`:

```tsx
// State
const [izinSakitModalVisible, setIzinSakitModalVisible] = useState(false);
const [selectedStatus, setSelectedStatus] = useState<"izin" | "sakit">("izin");

// Handler untuk membuka modal
const handleIzin = (sesiId: string, kelasId: string, className: string) => {
  setSelectedSesiId(sesiId);
  setSelectedKelasId(kelasId);
  setSelectedClassName(className);
  setSelectedStatus("izin");
  setIzinSakitModalVisible(true);
};

// Handler untuk submit
const handleSubmitIzinSakit = async (file: any, status: "izin" | "sakit") => {
  const result = await submitIzinSakitHandler(
    selectedKelasId,
    selectedSesiId,
    status,
    file
  );
  // Handle success
};

// Render modal
<PengajuanIzinSakitModal
  visible={izinSakitModalVisible}
  onDismiss={() => setIzinSakitModalVisible(false)}
  onSubmit={handleSubmitIzinSakit}
  title={selectedClassName}
  status={selectedStatus}
/>;
```

## 🎨 UI/UX

- **Header**: Menampilkan "Pengajuan Izin" atau "Pengajuan Sakit" dan nama mata kuliah
- **Keterangan Field**:
  - Multiline TextInput
  - Placeholder: "Masukkan keterangan"
  - 3 lines minimum
- **Upload Area**:
  - Border dashed saat belum ada file
  - Preview gambar dengan remove button saat sudah ada file
- **Buttons**:
  - BATAL (outlined, gray)
  - AJUKAN (contained, black) - disabled jika belum pilih file

## 🔐 Permissions

Aplikasi akan meminta permission berikut:

- **iOS**: `NSPhotoLibraryUsageDescription`
- **Android**: `READ_EXTERNAL_STORAGE` (otomatis oleh expo-image-picker)

## ⚠️ Error Handling

1. **Permission Denied**: Alert "Izinkan aplikasi untuk mengakses galeri foto Anda"
2. **File Picker Error**: Alert "Gagal memilih gambar"
3. **No Keterangan**: Alert "Silakan isi keterangan terlebih dahulu"
4. **No File Selected**: Alert "Silakan pilih file bukti terlebih dahulu"
5. **API Error**: Alert dengan pesan error dari server

## 🧪 Testing

1. Test permission request
2. Test keterangan input (multiline)
3. Test file selection
4. Test file preview
5. Test file removal
6. Test submit tanpa keterangan (validation)
7. Test submit tanpa file (validation)
8. Test submit dengan keterangan & file valid
9. Test API error handling
10. Test success flow dengan refresh data

## 📦 Dependencies

```json
{
  "expo-image-picker": "^15.0.x",
  "react-native-paper": "^5.14.5",
  "axios": "^1.12.2"
}
```

## 🚀 Next Steps (Optional)

- [ ] Tambah upload multiple files
- [ ] Tambah validasi ukuran file (max 5MB)
- [ ] Tambah crop image before upload
- [ ] Tambah keterangan/alasan text field
- [ ] Tambah preview PDF file
