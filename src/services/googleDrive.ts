import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { updateLetterDriveSync } from './api';

// Initialize Firebase SDK
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Provider with Drive file scope
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.setCustomParameters({
  prompt: 'select_account',
});

let isSigningIn = false;
// MANDATORY: In-memory caching only for access token (never in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;
const FOLDER_NAME = 'Arsip Persuratan Digital KPI - Universitas Al-Fithrah';
let cachedFolderId: string | null = null;

// Initialize auth state listener
export const initGoogleAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      cachedFolderId = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google Popup
export const signInWithGoogle = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan token akses dari Google.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getGoogleAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const signOutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  cachedFolderId = null;
};

// =================== GOOGLE DRIVE API HELPERS ===================

/**
 * Finds or creates the dedicated letters archive folder in the user's Google Drive.
 */
export async function getOrCreateDriveFolder(accessToken: string): Promise<string> {
  if (cachedFolderId) return cachedFolderId;

  // Search if folder already exists
  const query = encodeURIComponent(`mimeType='application/vnd.google-apps.folder' and name='${FOLDER_NAME}' and trashed=false`);
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!searchRes.ok) {
    throw new Error('Gagal mencari folder di Google Drive. Periksa izin akses.');
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    cachedFolderId = searchData.files[0].id;
    return cachedFolderId!;
  }

  // Create folder if not found
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Folder arsip resmi surat masuk, surat keluar, dan dokumen persuratan Prodi KPI Universitas Al-Fithrah Surabaya.',
    }),
  });

  if (!createRes.ok) {
    throw new Error('Gagal membuat folder di Google Drive.');
  }

  const createData = await createRes.json();
  cachedFolderId = createData.id;
  return cachedFolderId!;
}

/**
 * Uploads a letter's PDF file directly to the dedicated Google Drive folder.
 */
export async function uploadLetterPdfToDrive(
  accessToken: string,
  pdfBlob: Blob,
  fileName: string,
  metadataDescription?: string
): Promise<{ fileId: string; webViewLink?: string; name: string }> {
  const folderId = await getOrCreateDriveFolder(accessToken);

  // Metadata for the file
  const metadata = {
    name: fileName,
    parents: [folderId],
    description: metadataDescription || 'Surat resmi Program Studi Komunikasi dan Penyiaran Islam Universitas Al-Fithrah Surabaya',
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', pdfBlob);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Drive upload error:', errorText);
    throw new Error('Gagal mengunggah berkas surat ke Google Drive.');
  }

  const data = await res.json();
  return {
    fileId: data.id,
    webViewLink: data.webViewLink,
    name: data.name,
  };
}

/**
 * Syncs an individual letter from the system to Google Drive.
 */
export async function syncLetterToDrive(
  accessToken: string,
  letter: { id: string; letterNumber: string; title: string; category?: string }
): Promise<{ fileId: string; webViewLink?: string; name: string }> {
  const res = await fetch(`/api/letters/${letter.id}/pdf`);
  if (!res.ok) {
    throw new Error('Gagal mengunduh berkas PDF surat dari server untuk disinkronkan ke Drive.');
  }
  const blob = await res.blob();
  const cleanNumber = letter.letterNumber.replace(/[/\\?%*:|"<>]/g, '_');
  const cleanTitle = letter.title.replace(/[/\\?%*:|"<>]/g, '_').slice(0, 50);
  const fileName = `Surat_${cleanNumber}_${cleanTitle}.pdf`;

  const uploadResult = await uploadLetterPdfToDrive(
    accessToken,
    blob,
    fileName,
    `Arsip Surat UAF: ${letter.letterNumber} - ${letter.title}`
  );

  await updateLetterDriveSync(letter.id, {
    driveFileId: uploadResult.fileId,
    driveWebViewLink: uploadResult.webViewLink,
    isSyncedToDrive: true,
  });

  return uploadResult;
}

/**
 * Lists files in the Google Drive archive folder
 */
export async function listDriveLetters(accessToken: string): Promise<any[]> {
  try {
    const folderId = await getOrCreateDriveFolder(accessToken);
    const query = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,webViewLink,size,createdTime)&orderBy=createdTime desc`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.error('Error listing drive letters:', err);
    return [];
  }
}
