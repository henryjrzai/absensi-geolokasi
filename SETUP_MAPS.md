# Setup OpenStreetMap untuk Absensi Berbasis Lokasi

## Keuntungan Menggunakan OpenStreetMap:

✅ **100% Gratis** - Tidak perlu API Key  
✅ **Unlimited** - Tidak ada batasan request  
✅ **Open Source** - Data peta terbuka  
✅ **Mudah Setup** - Langsung jalan tanpa konfigurasi tambahan

## Langkah-langkah Setup:

### 1. Dependencies (Sudah Terinstal)

Package yang digunakan:

- `expo-location` - untuk mendapatkan lokasi perangkat
- `react-native-maps` - untuk menampilkan peta (menggunakan OpenStreetMap)

### 2. Build Aplikasi

Karena menggunakan native modules, rebuild aplikasi:

```bash
# Untuk Android
npx expo prebuild --clean
npx expo run:android

# Atau dengan EAS Build
eas build --platform android
```

**Tidak perlu Google Maps API Key!** 🎉

### 3. Testing

Setelah aplikasi berjalan:

1. Buka halaman "Absensi Aktif"
2. Klik tombol "HADIR" pada salah satu kelas
3. Aplikasi akan meminta izin akses lokasi
4. Setelah izin diberikan, peta OpenStreetMap akan muncul dengan marker lokasi Anda
5. Klik tombol "HADIR" di bawah peta untuk submit absensi

## Fitur yang Telah Diimplementasikan:

✅ Mendapatkan lokasi real-time perangkat (latitude & longitude)  
✅ Menampilkan peta OpenStreetMap dengan marker lokasi pengguna  
✅ Modal absensi dengan tampilan sesuai desain  
✅ Mengirim data lokasi ke backend saat submit absensi  
✅ Notifikasi toast setelah absensi berhasil  
✅ Auto refresh data setelah absensi

## Troubleshooting:

### Peta tidak muncul atau blank

- Pastikan koneksi internet aktif (OpenStreetMap memerlukan internet untuk load tiles)
- Rebuild aplikasi setelah install dependencies
- Coba restart aplikasi

### Tidak bisa mendapatkan lokasi

- Pastikan lokasi/GPS di perangkat sudah aktif
- Pastikan aplikasi sudah diberi izin akses lokasi
- Coba test di perangkat fisik, bukan emulator

### Error "Unable to get current location"

- Pastikan di setting perangkat, permission lokasi untuk aplikasi sudah diaktifkan
- Restart aplikasi dan coba lagi

## Perbandingan: OpenStreetMap vs Google Maps

| Fitur             | OpenStreetMap       | Google Maps                  |
| ----------------- | ------------------- | ---------------------------- |
| **Biaya**         | 🟢 Gratis selamanya | 🟡 $200/bulan free credit    |
| **API Key**       | 🟢 Tidak perlu      | 🔴 Wajib (ribet setup)       |
| **Batasan**       | 🟢 Unlimited        | 🟡 28,000 loads/bulan (free) |
| **Kualitas Peta** | 🟢 Bagus            | 🟢 Sangat bagus              |
| **Setup**         | 🟢 Sangat mudah     | 🟡 Butuh konfigurasi         |
| **Open Source**   | 🟢 Ya               | 🔴 Tidak                     |

## Catatan Penting:

✅ **Tidak perlu API Key** - Langsung jalan!  
✅ **Gratis unlimited** - Tidak ada batasan request  
⚠️ Test di **perangkat fisik** untuk hasil terbaik (emulator kadang bermasalah dengan GPS)  
⚠️ **Native rebuild** diperlukan setelah install dependencies

## Struktur File yang Dibuat/Diubah:

```
components/
  ├── AbsensiMapModal.tsx         # Modal dengan peta untuk absensi

app/(mahasiswa)/
  ├── absensiAktif.tsx            # Update dengan modal maps

lib/models/
  ├── absensi.ts                  # Update fungsi submit dengan lat/long

app.json                          # Konfigurasi maps & permissions
```
