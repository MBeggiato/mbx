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

## 🚀 Getting Started

1. Start typing in the editor
2. Switch between **Edit**, **Preview**, and **Split** modes
3. Save your work to the Mbx OS file system
4. Open existing files with the file picker

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

> **Note**: This editor integrates seamlessly with the Mbx OS file system. Your files are shared across all apps!

## Happy coding! 🚀

*Built with ❤️ for Mbx OS*
`;

export default function MarkdownEditorApp() {
  const [markdown, setMarkdown] = useState<string>(defaultMarkdown);
  const [fileName, setFileName] = useState<string>("welcome.md");
  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "split">(
    "editor"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateFileOpen, setIsCreateFileOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [virtualFiles, setVirtualFiles] = useState<VirtualFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  // Load auto-save and files on mount
  useEffect(() => {
    const autoSave = loadAutoSave("markdown-editor-new");
    if (autoSave) {
      setMarkdown(autoSave.content);
      setFileName(autoSave.filename);
      setHasUnsavedChanges(true);
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
          loadVirtualFile(pendingFile);
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
        if (
          hasUnsavedChanges &&
          !confirm(
            "You have unsaved changes. Are you sure you want to open a different file?"
          )
        ) {
          return;
        }
        loadVirtualFile(file);
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
  }, [hasUnsavedChanges]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (hasUnsavedChanges) {
        saveAutoSave(markdown, fileName, "markdown-editor-new");
      }
    }, 2000);

    return () => clearInterval(autoSaveInterval);
  }, [markdown, fileName, hasUnsavedChanges]);

  const handleMarkdownChange = useCallback((value?: string) => {
    if (value !== undefined) {
      setMarkdown(value);
      setHasUnsavedChanges(true);
    }
  }, []);

  const loadVirtualFile = useCallback((file: VirtualFile) => {
    setMarkdown(file.content);
    setFileName(file.name);
    setCurrentFileId(file.id);
    setHasUnsavedChanges(false);
    clearAutoSave();
  }, []);

  const saveToVirtualFileSystem = useCallback(async () => {
    if (!fileName.trim()) return;

    setIsSaving(true);
    try {
      const extension = fileName.endsWith(".md") ? "" : ".md";
      const fullName = `${fileName}${extension}`;

      if (currentFileId) {
        // Update existing file
        updateFile(currentFileId, {
          name: fullName,
          content: markdown,
        });
      } else {
        // Create new file
        const newFile = saveFile({
          name: fullName,
          content: markdown,
          type: "markdown",
        });
        setCurrentFileId(newFile.id);
      }

      setFileName(fullName);
      setHasUnsavedChanges(false);
      clearAutoSave();

      // Refresh files list
      setVirtualFiles(loadFiles());
    } catch (error) {
      console.error("Error saving to virtual file system:", error);
      alert("Error saving file: " + (error as Error).message);
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  }, [markdown, fileName, currentFileId]);

  const handleNewFile = useCallback(() => {
    if (
      hasUnsavedChanges &&
      !confirm(
        "You have unsaved changes. Are you sure you want to create a new file?"
      )
    ) {
      return;
    }

    setMarkdown("");
    setFileName("untitled.md");
    setCurrentFileId(null);
    setHasUnsavedChanges(false);
    clearAutoSave();
  }, [hasUnsavedChanges]);

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;

    const extension = newFileName.endsWith(".md") ? "" : ".md";
    const fullName = `${newFileName}${extension}`;

    setMarkdown("");
    setFileName(fullName);
    setCurrentFileId(null);
    setHasUnsavedChanges(true);
    setIsCreateFileOpen(false);
    setNewFileName("");
  };

  const handleDownloadFile = useCallback(() => {
    try {
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName.endsWith(".md") ? fileName : `${fileName}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }, [markdown, fileName]);

  const handleLoadFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setMarkdown(content);
          setFileName(file.name);
          setCurrentFileId(null);
          setHasUnsavedChanges(true);
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
    navigator.clipboard.writeText(markdown).then(() => {
      alert("Content copied to clipboard!");
    });
  }, [markdown]);

  const textFiles = virtualFiles.filter(
    (f) => f.type === "markdown" || f.type === "text"
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-card">
        <div className="flex items-center space-x-2">
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
          {/* File name input */}
          <Input
            value={fileName}
            onChange={(e) => {
              setFileName(e.target.value);
              setHasUnsavedChanges(true);
            }}
            className="w-32 sm:w-48 h-8 text-xs sm:text-sm"
            placeholder="filename.md"
          />

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
                onClick={saveToVirtualFileSystem}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownloadFile}>
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
            onClick={saveToVirtualFileSystem}
            disabled={isSaving}
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
              <DropdownMenuItem onClick={copyToClipboard}>
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
              value={markdown}
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
                  <MarkdownPreview source={markdown} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "split" && (
          <div className="flex flex-col lg:flex-row h-full">
            <div className="flex-1 border-b lg:border-b-0 lg:border-r">
              <MDEditor
                value={markdown}
                onChange={handleMarkdownChange}
                preview="edit"
                hideToolbar
                data-color-mode="light"
                height="100%"
              />
            </div>
            <div className="flex-1 overflow-auto">
              <div className="h-full p-4 sm:p-6">
                <MarkdownPreview source={markdown} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 text-xs text-muted-foreground border-t bg-muted/30">
        <div className="flex items-center space-x-4">
          <span>{markdown.length} characters</span>
          <span>{markdown.split("\\n").length} lines</span>
          {currentFileId && (
            <span className="hidden sm:inline">
              Saved: {formatFileSize(new Blob([markdown]).size)}
            </span>
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
        onFileSelect={loadVirtualFile}
        title="Open File"
        allowedTypes={["text", "markdown", "json"]}
        currentFileId={currentFileId}
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
