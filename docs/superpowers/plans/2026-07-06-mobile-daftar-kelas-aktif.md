# Mobile Daftar Kelas Aktif Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the old code-access enrollment UI with a two-section Matakuliah page that lists available active-year classes and enrolls by class ID.

**Architecture:** Keep all changes in the existing mahasiswa Matakuliah screen and `lib/models/matakuliah.ts`. Reuse existing axios `api`, React Native Paper cards/buttons/snackbar, and existing loaded-course flow. Comment old FAB/modal code instead of deleting it.

**Tech Stack:** Expo 54, React Native 0.81, React 19, TypeScript strict, Expo Router, react-native-paper, axios.

## Global Constraints

- Use Opsi 1: one `Matakuliah` page with two sections.
- Do not create a new screen.
- Do not delete old code-access enrollment permanently; comment old FAB/modal JSX first.
- `getAvailableCourses()` calls `GET /kelas/tersedia`.
- `registerCourseById(kelasId)` calls `POST /kelas/{kelasId}/daftar`.
- Available classes show all active-year classes.
- Already-enrolled classes show a disabled `Sudah Terdaftar` button.
- Unregistered classes show a `Daftar` button.
- After successful registration, reload both owned courses and available courses.
- Do not add search or pagination.

---

## File Structure

- Modify `lib/models/matakuliah.ts`: add new API functions; leave old `registerCourse(accessCode)` intact.
- Modify `app/(mahasiswa)/matakuliah.tsx`: import new functions, add available-course state/load/register logic, render second section, comment old FAB/modal JSX.

---

### Task 1: Add mobile API model functions

**Files:**
- Modify: `lib/models/matakuliah.ts`

**Interfaces:**
- Produces: `getAvailableCourses(): Promise<any>`
- Produces: `registerCourseById(kelasId: number): Promise<{ success: boolean; data?: any; message?: string }>`

- [ ] Add this code after `getCourseListByStudent()`:

```ts
export async function getAvailableCourses() {
  try {
    const response = await api.get(`/kelas/tersedia`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

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

- [ ] Keep old `registerCourse(accessCode)` unchanged.

---

### Task 2: Update Matakuliah screen UI

**Files:**
- Modify: `app/(mahasiswa)/matakuliah.tsx`

**Interfaces:**
- Consumes: `getCourseListByStudent()` existing.
- Consumes: `getAvailableCourses()` from Task 1.
- Consumes: `registerCourseById(kelasId)` from Task 1.

- [ ] Update import:

```ts
import {
  getAvailableCourses,
  getCourseListByStudent,
  registerCourse,
  registerCourseById,
} from "@/lib/models/matakuliah";
```

- [ ] Add state near existing course state:

```ts
const [availableCourses, setAvailableCourses] = useState<any[]>([]);
const [loadingAvailableCourses, setLoadingAvailableCourses] = useState<boolean>(true);
const [submittingCourseId, setSubmittingCourseId] = useState<number | null>(null);
```

- [ ] Add `loadAvailableCourses` below `loadCourses`:

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

- [ ] Update refresh and mount:

```ts
const onRefresh = async () => {
  setRefreshing(true);
  await Promise.all([loadCourses(), loadAvailableCourses()]);
  setRefreshing(false);
};

useEffect(() => {
  loadCourses();
  loadAvailableCourses();
}, []);
```

- [ ] Add registration handler after `handleAddCourse`:

```ts
const handleRegisterAvailableCourse = async (kelasId: number) => {
  setSubmittingCourseId(kelasId);
  const result = await registerCourseById(kelasId);
  setSubmittingCourseId(null);

  if (result.success) {
    await Promise.all([loadCourses(), loadAvailableCourses()]);
    setSnackbarMessage("Berhasil mendaftar kelas.");
    setSnackbarVisible(true);
    return;
  }

  setSnackbarMessage(result.message || "Gagal mendaftar kelas.");
  setSnackbarVisible(true);
};
```

- [ ] Add `Kelas Tersedia` section after owned-course rendering and before `</ScrollView>`:

```tsx
<View style={styles.sectionHeader}>
  <Text variant="titleMedium" style={styles.sectionTitle}>
    Kelas Tersedia
  </Text>
</View>

{loadingAvailableCourses ? (
  <View style={styles.stateCard}>
    <ActivityIndicator size="small" />
    <Text style={styles.stateText}>Memuat kelas tersedia...</Text>
  </View>
) : availableCourses.length === 0 ? (
  <View style={styles.stateCard}>
    <MaterialIcons name="inbox" size={20} color="#777" />
    <Text style={styles.stateText}>Tidak ada kelas tersedia.</Text>
  </View>
) : (
  <View>
    {availableCourses.map((course) => (
      <Card style={styles.availableCourseCard} key={course.id}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.availableCourseTitle}>
            {course.nama_kelas}
          </Text>
          <Text variant="bodyMedium">Dosen: {course.dosen?.nama || "-"}</Text>
          <Text variant="bodyMedium">Prodi: {course.prodi?.nama_prodi || "-"}</Text>
          {course.jadwal?.length > 0 && (
            <View style={styles.scheduleList}>
              {course.jadwal.map((jadwal: any) => (
                <Text key={jadwal.id} variant="bodySmall" style={styles.scheduleText}>
                  {jadwal.hari} • {jadwal.jam?.jam_mulai?.slice(0, 5)} - {jadwal.jam?.jam_selesai?.slice(0, 5)} • {jadwal.ruangan?.nama_ruangan || "-"}
                </Text>
              ))}
            </View>
          )}
          <Button
            mode={course.sudah_terdaftar ? "outlined" : "contained"}
            disabled={course.sudah_terdaftar || submittingCourseId === course.id}
            loading={submittingCourseId === course.id}
            onPress={() => handleRegisterAvailableCourse(course.id)}
            style={styles.registerButton}
          >
            {course.sudah_terdaftar ? "Sudah Terdaftar" : "Daftar"}
          </Button>
        </Card.Content>
      </Card>
    ))}
  </View>
)}
```

- [ ] Comment old FAB JSX and old modal JSX with JSX comments:

```tsx
{/* Tombol tambah kelas lama pakai kode akses. Disimpan sementara untuk rollback.
<AnimatedFAB ... />
*/}
```

```tsx
{/* Modal tambah kelas lama pakai kode akses. Disimpan sementara untuk rollback.
<Modal ...>...</Modal>
*/}
```

- [ ] Add styles:

```ts
availableCourseCard: {
  marginBottom: 10,
  borderRadius: 12,
  backgroundColor: "white",
},
availableCourseTitle: {
  fontWeight: "700",
  marginBottom: 6,
},
scheduleList: {
  marginTop: 8,
  gap: 4,
},
scheduleText: {
  color: "#555",
},
registerButton: {
  marginTop: 12,
},
```

---

## Final Verification

- [ ] Run lint:

```bash
npm run lint
```

Expected: no new TypeScript/ESLint errors from changed files.

- [ ] Run app manually:

```bash
npx expo start --clear
```

Manual expected:
- Login mahasiswa.
- Open Matakuliah.
- Section `Matakuliah Yang Diambil` still loads.
- Section `Kelas Tersedia` loads.
- Old FAB/modal kode akses no longer visible.
- `Sudah Terdaftar` disabled for enrolled classes.
- `Daftar` registers unenrolled class and refreshes both sections.
