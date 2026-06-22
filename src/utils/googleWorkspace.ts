import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Request Workspace Drive scopes
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Clear everything if we don't have token in-memory
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Initiate Google Sign-Inpopup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve access token from Google Authentication.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign-in error details:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// ==========================================
// GOOGLE DRIVE CORE INTEGRATION
// ==========================================

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
}

/**
 * Searches for a file on Google Drive by name
 */
export async function findFileByName(fileName: string, token: string): Promise<string | null> {
  const query = encodeURIComponent(`name = '${fileName}' and trashed = false`);
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`;
  
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!res.ok) {
      throw new Error(`Google Drive Search API returned status ${res.status}`);
    }
    
    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
    return null;
  } catch (err) {
    console.error('Google Drive search failed:', err);
    return null;
  }
}

/**
 * Creates/Saves a JSON file in Google Drive. Overwrites if file already exists after prompt/confirmation.
 */
export async function saveFileToDrive(
  fileName: string,
  dataContent: any,
  token: string
): Promise<{ success: boolean; fileId?: string; isNew?: boolean }> {
  try {
    const existingFileId = await findFileByName(fileName, token);
    const contentString = JSON.stringify(dataContent, null, 2);
    
    if (existingFileId) {
      // Overwrite/Update existing file
      const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`;
      const updateRes = await fetch(uploadUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: contentString,
      });
      
      if (!updateRes.ok) {
        throw new Error(`Failed to update existing Drive file contents: ${updateRes.status}`);
      }
      
      return { success: true, fileId: existingFileId, isNew: false };
    } else {
      // Create new file metadata first
      const metaUrl = 'https://www.googleapis.com/drive/v3/files';
      const metaRes = await fetch(metaUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fileName,
          mimeType: 'application/json',
        }),
      });
      
      if (!metaRes.ok) {
        throw new Error(`Failed to create Drive file metadata: ${metaRes.status}`);
      }
      
      const metaData = await metaRes.json();
      const newFileId = metaData.id;
      
      // Upload actual media
      const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${newFileId}?uploadType=media`;
      const uploadRes = await fetch(uploadUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: contentString,
      });
      
      if (!uploadRes.ok) {
        throw new Error(`Failed to upload media contents to newly created file: ${uploadRes.status}`);
      }
      
      return { success: true, fileId: newFileId, isNew: true };
    }
  } catch (error) {
    console.error('Error saving file to Google Drive:', error);
    throw error;
  }
}

/**
 * Downloads a JSON file content by name.
 */
export async function loadFileFromDrive(fileName: string, token: string): Promise<any> {
  try {
    const fileId = await findFileByName(fileName, token);
    if (!fileId) {
      return null;
    }
    
    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const res = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!res.ok) {
      throw new Error(`Download of file ${fileName} failed: status ${res.status}`);
    }
    
    return await res.json();
  } catch (err) {
    console.error(`Error downloading file ${fileName} from Google Drive:`, err);
    throw err;
  }
}

/**
 * Searches for a folder on Google Drive by name
 */
export async function findFolderByName(folderName: string, token: string): Promise<string | null> {
  const query = encodeURIComponent(`name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!res.ok) {
      throw new Error(`Google Drive Search API returned status ${res.status}`);
    }
    
    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
    return null;
  } catch (err) {
    console.error('Google Drive folder search failed:', err);
    return null;
  }
}

/**
 * Creates a folder inside Google Drive
 */
export async function createFolder(folderName: string, token: string): Promise<string> {
  const url = 'https://www.googleapis.com/drive/v3/files';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });
    
    if (!res.ok) {
      throw new Error(`Failed to create Google Drive folder: ${res.statusText}`);
    }
    
    const data = await res.json();
    return data.id;
  } catch (err) {
    console.error('Folder creation failed:', err);
    throw err;
  }
}

/**
 * Saves a file inside a specific Google Drive folder ID
 */
export async function saveFileToFolder(
  folderId: string,
  fileName: string,
  dataContent: any,
  token: string
): Promise<{ success: boolean; fileId: string; isNew: boolean }> {
  try {
    // Search for existing file inside this specific folder
    const query = encodeURIComponent(`name = '${fileName}' and '${folderId}' in parents and trashed = false`);
    const findUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`;
    
    let existingFileId: string | null = null;
    const findRes = await fetch(findUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (findRes.ok) {
      const data = await findRes.json();
      if (data.files && data.files.length > 0) {
        existingFileId = data.files[0].id;
      }
    }

    const contentString = typeof dataContent === 'string' ? dataContent : JSON.stringify(dataContent, null, 2);

    if (existingFileId) {
      // Overwrite/Update existing file
      const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`;
      const updateRes = await fetch(uploadUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: contentString,
      });
      
      if (!updateRes.ok) {
        throw new Error(`Failed to update Drive file inside folder: ${updateRes.status}`);
      }
      
      return { success: true, fileId: existingFileId, isNew: false };
    } else {
      // Create metadata inside the folder
      const metaUrl = 'https://www.googleapis.com/drive/v3/files';
      const metaRes = await fetch(metaUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fileName,
          mimeType: 'application/json',
          parents: [folderId],
        }),
      });
      
      if (!metaRes.ok) {
        throw new Error(`Failed to create file metadata inside specific folder: ${metaRes.status}`);
      }
      
      const metaData = await metaRes.json();
      const newFileId = metaData.id;
      
      // Upload actual media
      const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${newFileId}?uploadType=media`;
      const uploadRes = await fetch(uploadUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: contentString,
      });
      
      if (!uploadRes.ok) {
        throw new Error(`Failed to upload media contents inside folder: ${uploadRes.status}`);
      }
      
      return { success: true, fileId: newFileId, isNew: true };
    }
  } catch (error) {
    console.error('Error saving file inside folder:', error);
    throw error;
  }
}

/**
 * Lists all files inside a specific folder ID
 */
export async function listFilesFromFolder(
  folderId: string,
  token: string
): Promise<DriveFile[]> {
  try {
    const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,modifiedTime)&orderBy=modifiedTime desc`;
    
    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) {
      throw new Error(`Listing files from folder failed: status ${res.status}`);
    }
    
    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.error('Error listing files inside Google Drive folder:', err);
    throw err;
  }
}

