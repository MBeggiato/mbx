// Shared file system for Mbx OS apps
// This provides a unified localStorage-based file system that can be used across multiple apps

export type VirtualFile = {
  id: string;
  name: string;
  content: string;
  type: "markdown" | "text" | "json" | "other";
  size: number;
  createdAt: string;
  updatedAt: string;
  folder?: string;
  tags?: string[];
  mimeType?: string;
  isHidden?: boolean;
};

export interface VirtualFolder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
}

const VIRTUAL_FILES_KEY = "mbx-os-files";
const VIRTUAL_FOLDERS_KEY = "mbx-os-folders";

// Utility functions
export const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export const getFileType = (
  filename: string
): "markdown" | "text" | "json" | "other" => {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "md":
    case "markdown":
      return "markdown";
    case "txt":
      return "text";
    case "json":
      return "json";
    default:
      return "other";
  }
};

export const getMimeType = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "md":
    case "markdown":
      return "text/markdown";
    case "txt":
      return "text/plain";
    case "json":
      return "application/json";
    case "html":
      return "text/html";
    case "css":
      return "text/css";
    case "js":
      return "application/javascript";
    default:
      return "text/plain";
  }
};

// File operations
export const saveFile = (
  file: Omit<VirtualFile, "id" | "createdAt" | "updatedAt" | "size">
): VirtualFile => {
  const files = loadFiles();
  const now = new Date().toISOString();
  const size = new Blob([file.content]).size;

  const newFile: VirtualFile = {
    ...file,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    size,
    type: getFileType(file.name),
    mimeType: getMimeType(file.name),
  };

  files.push(newFile);
  localStorage.setItem(VIRTUAL_FILES_KEY, JSON.stringify(files));

  // Dispatch event for other apps to listen to
  window.dispatchEvent(
    new CustomEvent("virtualFileSystemChange", {
      detail: { action: "create", file: newFile },
    })
  );

  return newFile;
};

export const updateFile = (
  id: string,
  updates: Partial<VirtualFile>
): VirtualFile | null => {
  const files = loadFiles();
  const fileIndex = files.findIndex((f) => f.id === id);

  if (fileIndex === -1) return null;

  const size = updates.content
    ? new Blob([updates.content]).size
    : files[fileIndex].size;

  files[fileIndex] = {
    ...files[fileIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
    size,
    type: updates.name ? getFileType(updates.name) : files[fileIndex].type,
    mimeType: updates.name
      ? getMimeType(updates.name)
      : files[fileIndex].mimeType,
  };

  localStorage.setItem(VIRTUAL_FILES_KEY, JSON.stringify(files));

  // Dispatch event for other apps to listen to
  window.dispatchEvent(
    new CustomEvent("virtualFileSystemChange", {
      detail: { action: "update", file: files[fileIndex] },
    })
  );

  return files[fileIndex];
};

export const deleteFile = (id: string): boolean => {
  const files = loadFiles();
  const fileIndex = files.findIndex((f) => f.id === id);

  if (fileIndex === -1) return false;

  const deletedFile = files[fileIndex];
  files.splice(fileIndex, 1);
  localStorage.setItem(VIRTUAL_FILES_KEY, JSON.stringify(files));

  // Dispatch event for other apps to listen to
  window.dispatchEvent(
    new CustomEvent("virtualFileSystemChange", {
      detail: { action: "delete", file: deletedFile },
    })
  );

  return true;
};

export const loadFiles = (): VirtualFile[] => {
  try {
    const stored = localStorage.getItem(VIRTUAL_FILES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const getFile = (id: string): VirtualFile | null => {
  const files = loadFiles();
  return files.find((f) => f.id === id) || null;
};

export const searchFiles = (query: string): VirtualFile[] => {
  const files = loadFiles();
  const lowercaseQuery = query.toLowerCase();

  return files.filter(
    (file) =>
      file.name.toLowerCase().includes(lowercaseQuery) ||
      file.content.toLowerCase().includes(lowercaseQuery) ||
      (file.tags &&
        file.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)))
  );
};

export const getFilesByType = (type: VirtualFile["type"]): VirtualFile[] => {
  const files = loadFiles();
  return files.filter((f) => f.type === type);
};

// Folder operations (for future expansion)
export const saveFolders = (folders: VirtualFolder[]): void => {
  localStorage.setItem(VIRTUAL_FOLDERS_KEY, JSON.stringify(folders));
};

export const loadFolders = (): VirtualFolder[] => {
  try {
    const stored = localStorage.getItem(VIRTUAL_FOLDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Export/Import utilities
export const exportAllFiles = (): string => {
  const files = loadFiles();
  const folders = loadFolders();

  return JSON.stringify(
    {
      files,
      folders,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    },
    null,
    2
  );
};

export const importFiles = (
  jsonData: string
): { success: boolean; filesImported: number; error?: string } => {
  try {
    const data = JSON.parse(jsonData);

    if (!data.files || !Array.isArray(data.files)) {
      return { success: false, filesImported: 0, error: "Invalid file format" };
    }

    const existingFiles = loadFiles();
    const existingFolders = loadFolders();

    // Merge files (avoid duplicates by name)
    const existingNames = new Set(existingFiles.map((f) => f.name));
    const newFiles = data.files.filter(
      (file: VirtualFile) => !existingNames.has(file.name)
    );

    const allFiles = [...existingFiles, ...newFiles];
    localStorage.setItem(VIRTUAL_FILES_KEY, JSON.stringify(allFiles));

    // Merge folders if present
    if (data.folders && Array.isArray(data.folders)) {
      const existingFolderNames = new Set(existingFolders.map((f) => f.name));
      const newFolders = data.folders.filter(
        (folder: VirtualFolder) => !existingFolderNames.has(folder.name)
      );

      const allFolders = [...existingFolders, ...newFolders];
      saveFolders(allFolders);
    }

    // Dispatch event for other apps to listen to
    window.dispatchEvent(
      new CustomEvent("virtualFileSystemChange", {
        detail: { action: "import", filesCount: newFiles.length },
      })
    );

    return { success: true, filesImported: newFiles.length };
  } catch (error) {
    return {
      success: false,
      filesImported: 0,
      error: "Failed to parse import data",
    };
  }
};

// Storage info functionality
export const getStorageInfo = (): {
  used: number;
  total: number;
  files: number;
} => {
  const files = loadFiles();
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return {
    used: totalSize,
    total: 10 * 1024 * 1024, // 10MB limit for demo purposes
    files: files.length,
  };
};

// Auto-save functionality
const AUTO_SAVE_KEY = "mbx-os-autosave";

export const saveAutoSave = (
  content: string,
  filename: string,
  appId: string
): void => {
  const autoSave = {
    content,
    filename,
    appId,
    timestamp: Date.now(),
  };
  localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(autoSave));
};

export const loadAutoSave = (
  appId: string
): { content: string; filename: string; timestamp: number } | null => {
  try {
    const stored = localStorage.getItem(AUTO_SAVE_KEY);
    const autoSave = stored ? JSON.parse(stored) : null;

    // Return auto-save only if it's from the same app and within 24 hours
    if (
      autoSave &&
      autoSave.appId === appId &&
      autoSave.timestamp > Date.now() - 24 * 60 * 60 * 1000
    ) {
      return autoSave;
    }

    return null;
  } catch {
    return null;
  }
};

export const clearAutoSave = (): void => {
  localStorage.removeItem(AUTO_SAVE_KEY);
};
