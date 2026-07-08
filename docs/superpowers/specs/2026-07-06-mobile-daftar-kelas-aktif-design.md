# Desain Mobile Daftar Kelas Tahun Akademik Aktif

## Context
Mobile app Expo/React Native saat ini mendaftarkan kelas dari halaman `app/(mahasiswa)/matakuliah.tsx` lewat modal kode akses. API baru sudah tersedia di backend:

- `GET /api/kelas/tersedia`
- `POST /api/kelas/{kelasId}/daftar`

Flow baru tidak memakai kode kelas. Mahasiswa melihat kelas pada Tahun Akademik aktif lalu menekan tombol daftar pada kelas yang dipilih.

## Keputusan UI
Gunakan satu halaman `Matakuliah` dengan dua section:

1. **Matakuliah Yang Diambil**
   - Tetap memakai data dari `GET /kelas/mahasiswa`.
   - Card lama tetap bisa ditekan untuk membuka riwayat absensi.

2. **Kelas Tersedia**
   - Data dari `GET /kelas/tersedia`.
   - Menampilkan semua kelas Tahun Akademik aktif.
   - Jika `sudah_terdaftar = true`, tampilkan tombol disabled `Sudah Terdaftar`.
   - Jika `sudah_terdaftar = false`, tampilkan tombol `Daftar`.

Tombol/FAB lama `Tambah Kelas` dan modal kode akses lama dikomentari dulu, bukan dihapus.

## Data flow
Saat halaman `Matakuliah` dibuka:
1. Load matakuliah yang sudah diambil lewat `getCourseListByStudent()`.
2. Load kelas tersedia lewat `getAvailableCourses()`.
3. Render kedua section dalam satu `ScrollView`.

Saat mahasiswa menekan `Daftar`:
1. Set `submittingCourseId` ke ID kelas.
2. Panggil `registerCourseById(kelasId)`.
3. Jika sukses, tampilkan Snackbar `Berhasil mendaftar kelas.`.
4. Reload `getCourseListByStudent()` dan `getAvailableCourses()`.
5. Jika gagal, tampilkan message dari API.

## API model changes
File `lib/models/matakuliah.ts`:

Tambah:

```ts
export async function getAvailableCourses() {
  const response = await api.get(`/kelas/tersedia`);
  return response.data;
}
```

Tambah:

```ts
export async function registerCourseById(kelasId: number) {
  try {
    const response = await api.post(`/kelas/${kelasId}/daftar`);
    return { success: true, data: response.data };
  } catch (e: any) {
    const errorMessage =
      e.response?.data?.message || "Terjadi kesalahan saat mendaftar";

    return { success: false, message: errorMessage };
  }
}
```

Function lama `registerCourse(accessCode)` tetap ada untuk sementara, tetapi tidak dipakai oleh UI baru.

## UI changes
File `app/(mahasiswa)/matakuliah.tsx`:

State baru:

```ts
const [availableCourses, setAvailableCourses] = useState<any[]>([]);
const [loadingAvailableCourses, setLoadingAvailableCourses] = useState<boolean>(true);
const [submittingCourseId, setSubmittingCourseId] = useState<number | null>(null);
```

Function baru:

```ts
const loadAvailableCourses = async () => {
  try {
    const result = await getAvailableCourses();
    if (result.status) {
      setAvailableCourses(result.data);
    }
  } catch (err) {
    console.log("Error loading available courses:", err);
  } finally {
    setLoadingAvailableCourses(false);
  }
};
```

Function daftar baru:

```ts
const handleRegisterAvailableCourse = async (kelasId: number) => {
  setSubmittingCourseId(kelasId);
  const result = await registerCourseById(kelasId);
  setSubmittingCourseId(null);

  if (result.success) {
    await loadCourses();
    await loadAvailableCourses();
    setSnackbarMessage("Berhasil mendaftar kelas.");
    setSnackbarVisible(true);
    return;
  }

  setSnackbarMessage(result.message || "Gagal mendaftar kelas.");
  setSnackbarVisible(true);
};
```

Section `Kelas Tersedia` ditambahkan setelah section `Matakuliah Yang Diambil`.

Contoh isi card:

- Nama kelas: `course.nama_kelas`
- Dosen: `course.dosen?.nama`
- Prodi: `course.prodi?.nama_prodi`
- Jadwal: loop `course.jadwal`
- Tombol:
  - `Sudah Terdaftar` jika `course.sudah_terdaftar`
  - `Daftar` jika belum

## Old flow handling
Comment JSX untuk:

- `<AnimatedFAB ... />`
- `<Modal ...>` kode akses lama

State lama seperti `accessCode`, `modalVisible`, dan `submitting` boleh dibiarkan jika masih direferensikan oleh JSX yang dikomentari. Jika TypeScript/lint menganggap unused sebagai error, comment juga import/state/function lama yang tidak dipakai. Jangan hapus permanen.

## Files to change
- `lib/models/matakuliah.ts`
- `app/(mahasiswa)/matakuliah.tsx`

## Verification
1. Run lint/type check available in project:
   - `npm run lint`
2. Run app:
   - `npx expo start --clear`
3. Manual mobile flow:
   - login sebagai mahasiswa
   - buka tab/menu Matakuliah
   - lihat section `Matakuliah Yang Diambil`
   - lihat section `Kelas Tersedia`
   - kelas yang sudah terdaftar menampilkan tombol disabled
   - kelas belum terdaftar bisa ditekan `Daftar`
   - setelah daftar, kelas masuk ke section atas dan tombol di section bawah berubah `Sudah Terdaftar`

## Scope yang tidak dikerjakan
- Tidak membuat screen baru.
- Tidak menghapus kode lama secara permanen.
- Tidak menambah search/pagination.
- Tidak mengubah flow jadwal/absensi.
