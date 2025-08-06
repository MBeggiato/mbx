"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import {
  FileText,
  Download,
  Upload,
  Eye,
  Edit3,
  Save,
  FileImage,
  Loader2,
  Folder,
  Plus,
  Settings,
  Menu,
  X,
  MoreVertical,
  Copy,
  ExternalLink,
  FolderOpen,
  File,
  ChevronRight,
  ChevronDown,
  Trash2,
  Search,
  SidebarOpen,
  SidebarClose,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FilePickerDialog } from "@/components/ui/file-picker-dialog";
import {
  VirtualFile,
  saveFile,
  updateFile,
  loadFiles,
  formatFileSize,
  exportAllFiles,
  importFiles,
  saveAutoSave,
  loadAutoSave,
  clearAutoSave,
} from "@/lib/virtualFileSystem";

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64 bg-muted rounded-md">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading editor...</span>
        </div>
      </div>
    ),
  }
);

const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64 bg-muted rounded-md">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading preview...</span>
        </div>
      </div>
    ),
  }
);

const defaultMarkdown = `# Welcome to Mbx OS Markdown Editor

This is a **modern**, **responsive** markdown editor built for Mbx OS.

## ✨ Features

- 📝 **Live editing** with real-time preview
- 💾 **Auto-save** functionality 
- 🗂️ **File management** with the Mbx OS file system
- 📱 **Responsive design** that works on all screen sizes
- 🎨 **Modern UI** with clean, intuitive interface
- 🔄 **Import/Export** capabilities
- 🔍 **Advanced file picker** with search and filtering
- 📑 **Multiple file tabs** for editing multiple files simultaneously
- 🌲 **File tree** for easy navigation

## 🚀 Getting Started

1. Start typing in the editor
2. Switch between **Edit**, **Preview**, and **Split** modes
3. Save your work to the Mbx OS file system
4. Open existing files with the file picker or file tree
5. Use tabs to work with multiple files at once

### Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}! Welcome to Mbx OS!\`;
}

console.log(greet("World"));
\`\`\`

### Table Example

| Feature | Status |
|---------|--------|
| Editor | ✅ |
| Preview | ✅ |
| File System | ✅ |
| Auto-save | ✅ |
| Responsive | ✅ |
| Multi-tabs | ✅ |
| File Tree | ✅ |

> **Note**: This editor integrates seamlessly with the Mbx OS file system. Your files are shared across all apps!

## Happy coding! 🚀

*Built with ❤️ for Mbx OS*
`;

interface OpenFile {
  id: string;
  file: VirtualFile;
  content: string;
  hasUnsavedChanges: boolean;
}

export default function MarkdownEditorApp() {
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "split">(
    "editor"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateFileOpen, setIsCreateFileOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [virtualFiles, setVirtualFiles] = useState<VirtualFile[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  // Get current active file
  const activeFile = openFiles.find((f) => f.id === activeFileId);
  const currentContent = activeFile?.content || "";
  const currentFileName = activeFile?.file.name || "untitled.md";
  const hasUnsavedChanges = activeFile?.hasUnsavedChanges || false;

  // Load auto-save and files on mount
  useEffect(() => {
    // Initialize with welcome file if no files are open
    if (openFiles.length === 0) {
      const welcomeFile: VirtualFile = {
        id: "welcome",
        name: "welcome.md",
        content: defaultMarkdown,
        type: "markdown",
        size: new Blob([defaultMarkdown]).size,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const openFile: OpenFile = {
        id: "welcome",
        file: welcomeFile,
        content: defaultMarkdown,
        hasUnsavedChanges: false,
      };

      setOpenFiles([openFile]);
      setActiveFileId("welcome");
    }

    // Check for pending file to open
    const pendingFileData = localStorage.getItem("pendingFileToOpen");
    if (pendingFileData) {
      try {
        const pendingFile = JSON.parse(pendingFileData) as VirtualFile;
        localStorage.removeItem("pendingFileToOpen");

        // Load the pending file
        if (
          pendingFile &&
          (pendingFile.type === "markdown" ||
            pendingFile.type === "text" ||
            pendingFile.type === "json")
        ) {
          openFile(pendingFile);
        }
      } catch (error) {
        console.warn("Failed to load pending file:", error);
        localStorage.removeItem("pendingFileToOpen");
      }
    }

    // Load files for statistics
    setVirtualFiles(loadFiles());

    // Listen for file system changes
    const handleFileSystemChange = () => {
      setVirtualFiles(loadFiles());
    };

    // Listen for requests to open files from other apps
    const handleOpenMarkdownFile = (event: CustomEvent) => {
      const file = event.detail.file as VirtualFile;
      if (
        file &&
        (file.type === "markdown" ||
          file.type === "text" ||
          file.type === "json")
      ) {
        openFile(file);
      }
    };

    window.addEventListener("virtualFileSystemChange", handleFileSystemChange);
    window.addEventListener(
      "openMarkdownFile",
      handleOpenMarkdownFile as EventListener
    );

    return () => {
      window.removeEventListener(
        "virtualFileSystemChange",
        handleFileSystemChange
      );
      window.removeEventListener(
        "openMarkdownFile",
        handleOpenMarkdownFile as EventListener
      );
    };
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      openFiles.forEach((openFile) => {
        if (openFile.hasUnsavedChanges) {
          saveAutoSave(
            openFile.content,
            openFile.file.name,
            `markdown-editor-${openFile.id}`
          );
        }
      });
    }, 2000);

    return () => clearInterval(autoSaveInterval);
  }, [openFiles]);

  const handleMarkdownChange = useCallback(
    (value?: string) => {
      if (value !== undefined && activeFileId) {
        setOpenFiles((prev) =>
          prev.map((f) =>
            f.id === activeFileId
              ? { ...f, content: value, hasUnsavedChanges: true }
              : f
          )
        );
      }
    },
    [activeFileId]
  );

  const openFile = useCallback(
    (file: VirtualFile) => {
      const existingFile = openFiles.find((f) => f.file.id === file.id);

      if (existingFile) {
        // File is already open, just switch to it
        setActiveFileId(existingFile.id);
      } else {
        // Open new file
        const openFile: OpenFile = {
          id: file.id || `file-${Date.now()}`,
          file,
          content: file.content,
          hasUnsavedChanges: false,
        };

        setOpenFiles((prev) => [...prev, openFile]);
        setActiveFileId(openFile.id);
      }

      clearAutoSave();
    },
    [openFiles]
  );

  const closeFile = useCallback(
    (fileId: string) => {
      const file = openFiles.find((f) => f.id === fileId);

      if (file?.hasUnsavedChanges) {
        if (
          !confirm(
            `"${file.file.name}" has unsaved changes. Are you sure you want to close it?`
          )
        ) {
          return;
        }
      }

      setOpenFiles((prev) => {
        const newFiles = prev.filter((f) => f.id !== fileId);

        // If closing active file, switch to another file
        if (fileId === activeFileId) {
          if (newFiles.length > 0) {
            const currentIndex = prev.findIndex((f) => f.id === fileId);
            const nextFile =
              newFiles[Math.min(currentIndex, newFiles.length - 1)];
            setActiveFileId(nextFile.id);
          } else {
            setActiveFileId(null);
          }
        }

        return newFiles;
      });
    },
    [openFiles, activeFileId]
  );

  const saveCurrentFile = useCallback(async () => {
    if (!activeFile) return;

    setIsSaving(true);
    try {
      if (activeFile.file.id && activeFile.file.id !== "welcome") {
        // Update existing file
        updateFile(activeFile.file.id, {
          name: activeFile.file.name,
          content: activeFile.content,
        });
      } else {
        // Create new file
        const newFile = saveFile({
          name: activeFile.file.name,
          content: activeFile.content,
          type: "markdown",
        });

        // Update the open file with the new file ID
        setOpenFiles((prev) =>
          prev.map((f) =>
            f.id === activeFileId
              ? {
                  ...f,
                  file: { ...f.file, id: newFile.id },
                  hasUnsavedChanges: false,
                }
              : f
          )
        );
      }

      // Mark as saved
      setOpenFiles((prev) =>
        prev.map((f) =>
          f.id === activeFileId ? { ...f, hasUnsavedChanges: false } : f
        )
      );

      clearAutoSave();
      setVirtualFiles(loadFiles());
    } catch (error) {
      console.error("Error saving to virtual file system:", error);
      alert("Error saving file: " + (error as Error).message);
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  }, [activeFile, activeFileId]);

  const handleNewFile = useCallback(() => {
    const newFile: VirtualFile = {
      id: `new-${Date.now()}`,
      name: "untitled.md",
      content: "",
      type: "markdown",
      size: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const openFile: OpenFile = {
      id: newFile.id,
      file: newFile,
      content: "",
      hasUnsavedChanges: false,
    };

    setOpenFiles((prev) => [...prev, openFile]);
    setActiveFileId(newFile.id);
    clearAutoSave();
  }, []);

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;

    const extension = newFileName.endsWith(".md") ? "" : ".md";
    const fullName = `${newFileName}${extension}`;

    const newFile: VirtualFile = {
      id: `new-${Date.now()}`,
      name: fullName,
      content: "",
      type: "markdown",
      size: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const openFile: OpenFile = {
      id: newFile.id,
      file: newFile,
      content: "",
      hasUnsavedChanges: true,
    };

    setOpenFiles((prev) => [...prev, openFile]);
    setActiveFileId(newFile.id);
    setIsCreateFileOpen(false);
    setNewFileName("");
  };

  const handleDownloadFile = useCallback(() => {
    if (!activeFile) return;

    try {
      const blob = new Blob([activeFile.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = activeFile.file.name.endsWith(".md")
        ? activeFile.file.name
        : `${activeFile.file.name}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }, [activeFile]);

  const handleLoadFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;

          const newFile: VirtualFile = {
            id: `imported-${Date.now()}`,
            name: file.name,
            content,
            type: "markdown",
            size: new Blob([content]).size,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const openFile: OpenFile = {
            id: newFile.id,
            file: newFile,
            content,
            hasUnsavedChanges: true,
          };

          setOpenFiles((prev) => [...prev, openFile]);
          setActiveFileId(newFile.id);
        };
        reader.readAsText(file);
      }
    },
    []
  );

  const handleExportAll = useCallback(() => {
    const exportData = exportAllFiles();
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mbx-files-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleImportFiles = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const result = importFiles(content);

          if (result.success) {
            alert(`Successfully imported ${result.filesImported} files!`);
            setVirtualFiles(loadFiles());
          } else {
            alert(`Import failed: ${result.error}`);
          }
        };
        reader.readAsText(file);
      }
    },
    []
  );

  const copyToClipboard = useCallback(() => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content).then(() => {
      alert("Content copied to clipboard!");
    });
  }, [activeFile]);

  const textFiles = virtualFiles.filter(
    (f) => f.type === "markdown" || f.type === "text"
  );

  // Filter files for the tree view
  const filteredFiles = virtualFiles.filter((file) => {
    if (!searchTerm) return true;
    return (
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // File tree component
  const FileTree = () => (
    <div className="h-full flex flex-col bg-muted/30 border-r">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm">Files</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="h-6 w-6 p-0 lg:hidden"
          >
            <SidebarClose className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-7 text-xs pl-7"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {filteredFiles.length === 0 ? (
          <div className="text-center text-muted-foreground text-xs py-8">
            {searchTerm ? "No files found" : "No files yet"}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center space-x-2 p-2 rounded text-xs cursor-pointer hover:bg-muted/60 ${
                  openFiles.some((f) => f.file.id === file.id)
                    ? "bg-blue-100 dark:bg-blue-900/20"
                    : ""
                }`}
                onClick={() => openFile(file)}
              >
                {file.type === "markdown" ? (
                  <FileText className="h-3 w-3 text-blue-600" />
                ) : file.type === "text" ? (
                  <File className="h-3 w-3 text-green-600" />
                ) : (
                  <File className="h-3 w-3 text-gray-600" />
                )}
                <span className="truncate flex-1" title={file.name}>
                  {file.name}
                </span>
                {openFiles.some(
                  (f) => f.file.id === file.id && f.hasUnsavedChanges
                ) && <span className="text-orange-500">•</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-card">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-6 w-6 p-0"
          >
            {sidebarOpen ? (
              <SidebarClose className="h-4 w-4" />
            ) : (
              <SidebarOpen className="h-4 w-4" />
            )}
          </Button>
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="font-semibold hidden sm:inline">
            Markdown Editor
          </span>
          <span className="font-semibold sm:hidden">Editor</span>
          {hasUnsavedChanges && (
            <span className="text-xs text-orange-500">•</span>
          )}
          {textFiles.length > 0 && (
            <Badge variant="secondary" className="hidden sm:inline">
              {textFiles.length} files
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Current file name */}
          {activeFile && (
            <Input
              value={activeFile.file.name}
              onChange={(e) => {
                const newName = e.target.value;
                setOpenFiles((prev) =>
                  prev.map((f) =>
                    f.id === activeFileId
                      ? {
                          ...f,
                          file: { ...f.file, name: newName },
                          hasUnsavedChanges: true,
                        }
                      : f
                  )
                );
              }}
              className="w-32 sm:w-48 h-8 text-xs sm:text-sm"
              placeholder="filename.md"
            />
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="outline"
            size="sm"
            className="sm:hidden h-8 w-8 p-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-b bg-muted/50">
          <div className="p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" onClick={handleNewFile}>
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsFilePickerOpen(true)}
              >
                <Folder className="h-4 w-4 mr-1" />
                Open
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={saveCurrentFile}
                disabled={isSaving || !activeFile}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadFile}
                disabled={!activeFile}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Toolbar */}
      <div className="hidden sm:flex items-center justify-between p-2 border-b bg-muted/30">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewFile}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>

          <Dialog open={isCreateFileOpen} onOpenChange={setIsCreateFileOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <FileText className="h-4 w-4 mr-1" />
                Create
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New File</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newFileName">File Name</Label>
                  <Input
                    id="newFileName"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="my-document"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateFileOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateFile}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilePickerOpen(true)}
            className="h-8"
          >
            <Folder className="h-4 w-4 mr-1" />
            Open ({textFiles.length})
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="outline"
            size="sm"
            onClick={saveCurrentFile}
            disabled={isSaving || !activeFile}
            className="h-8"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            Save to Mbx OS
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadFile}
            disabled={!activeFile}
            className="h-8"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>File Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Import File
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={copyToClipboard}
                disabled={!activeFile}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Content
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Backup</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleExportAll}>
                <Download className="h-4 w-4 mr-2" />
                Export All Files
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => backupInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Import Backup
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* File Tabs */}
      {openFiles.length > 0 && (
        <div className="border-b bg-muted/20">
          <div className="flex items-center overflow-x-auto">
            {openFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center space-x-2 px-3 py-2 border-r cursor-pointer hover:bg-muted/50 ${
                  file.id === activeFileId
                    ? "bg-background border-b-2 border-blue-500"
                    : ""
                }`}
                onClick={() => setActiveFileId(file.id)}
              >
                <FileText className="h-3 w-3" />
                <span className="text-sm max-w-32 truncate">
                  {file.file.name}
                </span>
                {file.hasUnsavedChanges && (
                  <span className="text-orange-500 text-xs">•</span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(file.id);
                  }}
                  className="h-4 w-4 p-0 hover:bg-red-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 flex-shrink-0">
            <FileTree />
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {openFiles.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No files open</p>
                <p className="text-sm mb-4">
                  Create a new file or open an existing one to get started
                </p>
                <div className="space-x-2">
                  <Button onClick={handleNewFile}>
                    <Plus className="h-4 w-4 mr-2" />
                    New File
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsFilePickerOpen(true)}
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    Open File
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="border-b">
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as any)}
                  className="w-full"
                >
                  <TabsList className="h-10 w-full justify-start rounded-none bg-transparent p-0">
                    <TabsTrigger
                      value="editor"
                      className="h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="preview"
                      className="h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Preview</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="split"
                      className="h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
                    >
                      <FileImage className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Split</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-hidden">
                {activeTab === "editor" && (
                  <div className="h-full">
                    <MDEditor
                      value={currentContent}
                      onChange={handleMarkdownChange}
                      preview="edit"
                      hideToolbar
                      data-color-mode="light"
                      height="100%"
                    />
                  </div>
                )}

                {activeTab === "preview" && (
                  <div className="h-full overflow-auto">
                    <div className="max-w-4xl mx-auto p-4 sm:p-6">
                      <Card>
                        <CardContent className="p-4 sm:p-6">
                          <MarkdownPreview source={currentContent} />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === "split" && (
                  <div className="flex flex-col lg:flex-row h-full">
                    <div className="flex-1 border-b lg:border-b-0 lg:border-r">
                      <MDEditor
                        value={currentContent}
                        onChange={handleMarkdownChange}
                        preview="edit"
                        hideToolbar
                        data-color-mode="light"
                        height="100%"
                      />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <div className="h-full p-4 sm:p-6">
                        <MarkdownPreview source={currentContent} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 text-xs text-muted-foreground border-t bg-muted/30">
        <div className="flex items-center space-x-4">
          {activeFile ? (
            <>
              <span>{currentContent.length} characters</span>
              <span>{currentContent.split("\n").length} lines</span>
              {activeFile.file.id && activeFile.file.id !== "welcome" && (
                <span className="hidden sm:inline">
                  Saved: {formatFileSize(new Blob([currentContent]).size)}
                </span>
              )}
            </>
          ) : (
            <span>No file open</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <span className="text-orange-500">• Unsaved changes</span>
          )}
          <span className="hidden sm:inline">Mbx OS Markdown Editor</span>
        </div>
      </div>

      {/* File Picker Dialog */}
      <FilePickerDialog
        isOpen={isFilePickerOpen}
        onOpenChange={setIsFilePickerOpen}
        onFileSelect={openFile}
        title="Open File"
        allowedTypes={["text", "markdown", "json"]}
        currentFileId={activeFile?.file.id || null}
      />

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        onChange={handleLoadFile}
        className="hidden"
      />
      <input
        ref={backupInputRef}
        type="file"
        accept=".json"
        onChange={handleImportFiles}
        className="hidden"
      />
    </div>
  );
}
