import {
  Letter,
  DashboardStats,
  UserSession,
  Student,
  Lecturer,
  StudyProgram,
  CampusEvent
} from '../types/letter';

export const API_BASE = '/api';

// ----------------- Persuratan APIs -----------------
export async function fetchLetters(params?: {
  search?: string;
  category?: string;
  storageStatus?: string;
  dispositionStatus?: string;
  creatorIdentifier?: string;
  sortBy?: string;
}): Promise<{ data: Letter[]; total: number }> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.category) query.append('category', params.category);
  if (params?.storageStatus) query.append('storageStatus', params.storageStatus);
  if (params?.dispositionStatus) query.append('dispositionStatus', params.dispositionStatus);
  if (params?.creatorIdentifier) query.append('creatorIdentifier', params.creatorIdentifier);
  if (params?.sortBy) query.append('sortBy', params.sortBy);

  const url = `${API_BASE}/letters${query.toString() ? `?${query.toString()}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal memuat daftar surat.');
  }
  return response.json();
}

export async function fetchStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_BASE}/stats`);
  if (!response.ok) {
    throw new Error('Gagal memuat statistik persuratan.');
  }
  return response.json();
}

export async function fetchLetterById(id: string): Promise<Letter> {
  const response = await fetch(`${API_BASE}/letters/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal memuat detail surat.');
  }
  return response.json();
}

export async function createLetter(formData: FormData): Promise<Letter> {
  const response = await fetch(`${API_BASE}/letters`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal menambahkan surat.');
  }
  return response.json();
}

export async function generateSelfServiceLetter(payload: any): Promise<Letter> {
  const response = await fetch(`${API_BASE}/letters/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal menerbitkan surat permohonan.');
  }
  return response.json();
}

export async function updateLetter(id: string, formData: FormData): Promise<Letter> {
  const response = await fetch(`${API_BASE}/letters/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal memperbarui surat.');
  }
  return response.json();
}

export async function updateDisposition(
  id: string,
  payload: { dispositionTo: string; dispositionNote: string; dispositionStatus: string }
): Promise<Letter> {
  const response = await fetch(`${API_BASE}/letters/${id}/disposition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal memperbarui disposisi.');
  }
  return response.json();
}

export async function deleteLetter(id: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/letters/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal menghapus surat.');
  }
  return response.json();
}

export async function approveLetter(id: string, approverName?: string): Promise<Letter> {
  const response = await fetch(`${API_BASE}/letters/${id}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ approverName }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal menyetujui surat.');
  }
  return response.json();
}

export function getPdfUrl(id: string, download = false): string {
  return `${API_BASE}/letters/${id}/pdf${download ? '?download=1' : ''}`;
}

export function getBackupDownloadUrl(): string {
  return `${API_BASE}/backup`;
}

export async function loginUser(role: string, identifier: string, password?: string): Promise<{ success: boolean; user: UserSession; token: string }> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, identifier, password }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Kombinasi login tidak valid.');
  }
  return response.json();
}

export async function fetchPresetUsers(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/users/presets`);
  if (!response.ok) return [];
  return response.json();
}

// ----------------- Master Data: Mahasiswa APIs -----------------
export async function fetchStudents(): Promise<Student[]> {
  const response = await fetch(`${API_BASE}/students`);
  if (!response.ok) throw new Error('Gagal memuat data mahasiswa.');
  return response.json();
}

export async function createStudent(data: Omit<Student, 'id'>): Promise<Student> {
  const response = await fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal menambah mahasiswa.');
  }
  return response.json();
}

export async function updateStudent(id: string, data: Partial<Student>): Promise<Student> {
  const response = await fetch(`${API_BASE}/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal memperbarui mahasiswa.');
  }
  return response.json();
}

export async function deleteStudent(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Gagal menghapus mahasiswa.');
  return response.json();
}

// ----------------- Master Data: Dosen APIs -----------------
export async function fetchLecturers(): Promise<Lecturer[]> {
  const response = await fetch(`${API_BASE}/lecturers`);
  if (!response.ok) throw new Error('Gagal memuat data dosen.');
  return response.json();
}

export async function createLecturer(data: Omit<Lecturer, 'id'>): Promise<Lecturer> {
  const response = await fetch(`${API_BASE}/lecturers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal menambah dosen.');
  }
  return response.json();
}

export async function updateLecturer(id: string, data: Partial<Lecturer>): Promise<Lecturer> {
  const response = await fetch(`${API_BASE}/lecturers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal memperbarui dosen.');
  }
  return response.json();
}

export async function deleteLecturer(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/lecturers/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Gagal menghapus dosen.');
  return response.json();
}

// ----------------- Master Data: Program Studi APIs -----------------
export async function fetchStudyPrograms(): Promise<StudyProgram[]> {
  const response = await fetch(`${API_BASE}/study-programs`);
  if (!response.ok) throw new Error('Gagal memuat data program studi.');
  return response.json();
}

export async function createStudyProgram(data: Omit<StudyProgram, 'id'>): Promise<StudyProgram> {
  const response = await fetch(`${API_BASE}/study-programs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal menambah program studi.');
  }
  return response.json();
}

export async function updateStudyProgram(id: string, data: Partial<StudyProgram>): Promise<StudyProgram> {
  const response = await fetch(`${API_BASE}/study-programs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal memperbarui program studi.');
  }
  return response.json();
}

export async function deleteStudyProgram(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/study-programs/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Gagal menghapus program studi.');
  return response.json();
}

// ----------------- Master Data: Kegiatan & Event APIs -----------------
export async function fetchEvents(): Promise<CampusEvent[]> {
  const response = await fetch(`${API_BASE}/events`);
  if (!response.ok) throw new Error('Gagal memuat agenda kegiatan.');
  return response.json();
}

export async function createEvent(data: Omit<CampusEvent, 'id'>): Promise<CampusEvent> {
  const response = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal menambah kegiatan.');
  }
  return response.json();
}

export async function updateEvent(id: string, data: Partial<CampusEvent>): Promise<CampusEvent> {
  const response = await fetch(`${API_BASE}/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal memperbarui kegiatan.');
  }
  return response.json();
}

export async function deleteEvent(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/events/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Gagal menghapus kegiatan.');
  return response.json();
}

export async function updateLetterDriveSync(
  id: string,
  data: { driveFileId: string; driveWebViewLink?: string; isSyncedToDrive: boolean }
): Promise<Letter> {
  const response = await fetch(`${API_BASE}/letters/${id}/drive-sync`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal memperbarui status sinkronisasi Google Drive.');
  }
  return response.json();
}
