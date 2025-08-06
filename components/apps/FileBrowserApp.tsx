"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Folder,
  FolderOpen,
  File,
  FileText,
  FileImage,
  Download,
  Upload,
  Trash2,
  Search,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Clock,
  HardDrive,
  Plus,
  Edit,
  Eye,
  Copy,
  Share2,
  RefreshCw,
  Filter,
  Archive,
  Settings,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  VirtualFile,
  saveFile,
  updateFile,
  deleteFile,
  loadFiles,
  getFile,
  searchFiles,
  exportAllFiles,
  importFiles,
  formatFileSize,
  getStorageInfo,
} from "@/lib/virtualFileSystem";

type ViewMode = "grid" | "list";
type SortBy = "name" | "date" | "size" | "type";
type SortOrder = "asc" | "desc";
type FileFilter = "all" | "text" | "markdown" | "image" | "other";

const FILE_TYPE_ICONS = {
  text: FileText,
  markdown: FileText,
  json: FileText,
  image: FileImage,
  other: File,
};

const FILE_TYPE_COLORS = {
  text: "text-blue-600",
  markdown: "text-green-600",
  json: "text-yellow-600",
  image: "text-purple-600",
  other: "text-gray-600",
};

export default function FileBrowserApp() {
  const [files, setFiles] = useState<VirtualFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [fileFilter, setFileFilter] = useState<FileFilter>("all");
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isCreateFileOpen, setIsCreateFileOpen] = useState(false);
  const [isFileInfoOpen, setIsFileInfoOpen] = useState(false);
  const [selectedFileInfo, setSelectedFileInfo] = useState<VirtualFile | null>(
    null
  );
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");
  const [newFileType, setNewFileType] = useState<VirtualFile["type"]>("text");
  const [storageInfo, setStorageInfo] = useState({
    used: 0,
    total: 0,
    files: 0,
  });

  // Load files and storage info
  const refreshFiles = useCallback(() => {
    const loadedFiles = loadFiles();
    setFiles(loadedFiles);
    setStorageInfo(getStorageInfo());

    // Clear selection if selected files no longer exist
    setSelectedFiles((prev) => {
      const existingIds = new Set(loadedFiles.map((f) => f.id));
      return new Set([...prev].filter((id) => existingIds.has(id)));
    });
  }, []);

  useEffect(() => {
    refreshFiles();

    // Listen for file system changes from other apps
    const handleFileSystemChange = () => {
      refreshFiles();
    };

    window.addEventListener("virtualFileSystemChange", handleFileSystemChange);
    return () =>
      window.removeEventListener(
        "virtualFileSystemChange",
        handleFileSystemChange
      );
  }, [refreshFiles]);

  // Filter and sort files
  const filteredAndSortedFiles = files
    .filter((file) => {
      // Apply text filter
      const matchesSearch =
        !searchTerm ||
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.content.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply type filter
      const matchesType = fileFilter === "all" || file.type === fileFilter;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "date":
          comparison =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case "size":
          comparison = a.size - b.size;
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleFileSelect = (fileId: string, isCtrlClick: boolean = false) => {
    if (isCtrlClick) {
      setSelectedFiles((prev) => {
        const newSelection = new Set(prev);
        if (newSelection.has(fileId)) {
          newSelection.delete(fileId);
        } else {
          newSelection.add(fileId);
        }
        return newSelection;
      });
    } else {
      setSelectedFiles(new Set([fileId]));
    }
  };

  const handleFileDoubleClick = (file: VirtualFile) => {
    // Emit event to open file in appropriate app
    if (
      file.type === "markdown" ||
      file.type === "text" ||
      file.type === "json"
    ) {
      window.dispatchEvent(
        new CustomEvent("openMarkdownFile", { detail: { file } })
      );
    }
    // Add more file type handlers as needed
  };

  const handleOpenInMarkdownEditor = (file: VirtualFile) => {
    // Store the file to open in localStorage temporarily
    localStorage.setItem("pendingFileToOpen", JSON.stringify(file));

    // Dispatch event to open markdown editor window
    // This will be handled by the parent component (page.tsx)
    const event = new CustomEvent("openWindow", {
      detail: { windowId: "markdown" },
    });
    window.dispatchEvent(event);

    // Also try the direct file open event in case the window is already open
    window.dispatchEvent(
      new CustomEvent("openMarkdownFile", { detail: { file } })
    );
  };

  const handleDeleteSelected = () => {
    if (selectedFiles.size === 0) return;

    if (
      confirm(`Are you sure you want to delete ${selectedFiles.size} file(s)?`)
    ) {
      selectedFiles.forEach((fileId) => deleteFile(fileId));
      setSelectedFiles(new Set());
      refreshFiles();
    }
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;

    try {
      const extension = newFileType === "markdown" ? ".md" : ".txt";
      const fullName = newFileName.endsWith(extension)
        ? newFileName
        : `${newFileName}${extension}`;

      saveFile({
        name: fullName,
        content: newFileContent,
        type: newFileType,
      });

      setIsCreateFileOpen(false);
      setNewFileName("");
      setNewFileContent("");
      refreshFiles();
    } catch (error) {
      alert("Error creating file: " + (error as Error).message);
    }
  };

  const handleExportSelected = () => {
    if (selectedFiles.size === 0) return;

    const selectedFileObjects = files.filter((f) => selectedFiles.has(f.id));
    const exportData = JSON.stringify(selectedFileObjects, null, 2);

    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mbx-files-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportAll = () => {
    const exportData = exportAllFiles();

    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mbx-all-files-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = importFiles(content);

      if (result.success) {
        alert(`Successfully imported ${result.filesImported} files!`);
        refreshFiles();
      } else {
        alert(`Import failed: ${result.error}`);
      }
    };
    reader.readAsText(file);
  };

  const showFileInfo = (file: VirtualFile) => {
    setSelectedFileInfo(file);
    setIsFileInfoOpen(true);
  };

  const FileCard = ({ file }: { file: VirtualFile }) => {
    const Icon = FILE_TYPE_ICONS[file.type] || File;
    const isSelected = selectedFiles.has(file.id);

    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected
                ? "ring-2 ring-blue-500 bg-blue-50"
                : "hover:bg-muted/50"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleFileSelect(file.id, e.ctrlKey || e.metaKey);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleFileDoubleClick(file);
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
              console.log("Context menu triggered for:", file.name);
              if (!selectedFiles.has(file.id)) {
                setSelectedFiles(new Set([file.id]));
              }
            }}
          >
            <Card className="border-0 shadow-none">
              <CardContent className="p-4">
                {viewMode === "grid" ? (
                  <div className="text-center">
                    <Icon
                      className={`h-8 w-8 mx-auto mb-2 ${
                        FILE_TYPE_COLORS[file.type]
                      }`}
                    />
                    <div
                      className="text-sm font-medium truncate"
                      title={file.name}
                    >
                      {file.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatFileSize(file.size)}
                    </div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {file.type}
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`h-5 w-5 ${FILE_TYPE_COLORS[file.type]}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(file.updatedAt).toLocaleDateString()} •{" "}
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {file.type}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64 z-50">
          <ContextMenuItem
            onClick={(e) => {
              e.stopPropagation();
              console.log("Open clicked for:", file.name);
              handleFileDoubleClick(file);
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Open
          </ContextMenuItem>
          {(file.type === "markdown" ||
            file.type === "text" ||
            file.type === "json") && (
            <ContextMenuItem
              onClick={(e) => {
                e.stopPropagation();
                console.log("Open in Markdown Editor clicked for:", file.name);
                handleOpenInMarkdownEditor(file);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Open in Markdown Editor
            </ContextMenuItem>
          )}
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={(e) => {
              e.stopPropagation();
              console.log("Properties clicked for:", file.name);
              showFileInfo(file);
            }}
          >
            <Info className="h-4 w-4 mr-2" />
            Properties
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={(e) => {
              e.stopPropagation();
              console.log("Delete clicked for:", file.name);
              if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
                deleteFile(file.id);
                setSelectedFiles(new Set());
                refreshFiles();
              }
            }}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center space-x-2">
          <HardDrive className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">File Browser</span>
          <Badge variant="secondary">{files.length} files</Badge>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>{formatFileSize(storageInfo.used)} used</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center space-x-2">
          <Dialog open={isCreateFileOpen} onOpenChange={setIsCreateFileOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New File
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New File</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fileName">File Name</Label>
                  <Input
                    id="fileName"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="my-file"
                  />
                </div>
                <div>
                  <Label htmlFor="fileType">File Type</Label>
                  <Select
                    value={newFileType}
                    onValueChange={(value: VirtualFile["type"]) =>
                      setNewFileType(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text File (.txt)</SelectItem>
                      <SelectItem value="markdown">Markdown (.md)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fileContent">Initial Content</Label>
                  <Textarea
                    id="fileContent"
                    value={newFileContent}
                    onChange={(e) => setNewFileContent(e.target.value)}
                    placeholder="Enter file content..."
                    rows={6}
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
                <Button onClick={handleCreateFile}>Create File</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={refreshFiles}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Archive className="h-4 w-4 mr-1" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={handleExportSelected}
                disabled={selectedFiles.size === 0}
              >
                Export Selected ({selectedFiles.size})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportAll}>
                Export All Files
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <label htmlFor="import-files">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4 mr-1" />
                Import
              </span>
            </Button>
          </label>
          <input
            id="import-files"
            type="file"
            accept=".json"
            onChange={handleImportFiles}
            className="hidden"
          />

          {selectedFiles.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete ({selectedFiles.size})
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Select
            value={fileFilter}
            onValueChange={(value: FileFilter) => setFileFilter(value)}
          >
            <SelectTrigger className="w-24 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                {sortOrder === "asc" ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSortBy("name")}>
                Name {sortBy === "name" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("date")}>
                Date {sortBy === "date" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("size")}>
                Size {sortBy === "size" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("type")}>
                Type {sortBy === "type" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? "Descending" : "Ascending"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files and content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* File Grid/List */}
      <div className="flex-1 overflow-auto p-4">
        {filteredAndSortedFiles.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            {searchTerm || fileFilter !== "all" ? (
              <div>
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No files found matching your criteria</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setSearchTerm("");
                    setFileFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div>
                <HardDrive className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No files in the virtual file system</p>
                <p className="text-sm mt-1">
                  Create a new file or import files to get started
                </p>
              </div>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                : "space-y-2"
            }
          >
            {filteredAndSortedFiles.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground border-t bg-muted/30">
        <div className="flex items-center space-x-4">
          <span>{filteredAndSortedFiles.length} files shown</span>
          {selectedFiles.size > 0 && <span>{selectedFiles.size} selected</span>}
        </div>
        <div className="flex items-center space-x-2">
          <span>Storage: {formatFileSize(storageInfo.used)} used</span>
        </div>
      </div>

      {/* File Info Dialog */}
      <Dialog open={isFileInfoOpen} onOpenChange={setIsFileInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File Properties</DialogTitle>
          </DialogHeader>
          {selectedFileInfo && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {(() => {
                  const Icon = FILE_TYPE_ICONS[selectedFileInfo.type] || File;
                  return (
                    <Icon
                      className={`h-8 w-8 ${
                        FILE_TYPE_COLORS[selectedFileInfo.type]
                      }`}
                    />
                  );
                })()}
                <div>
                  <div className="font-medium">{selectedFileInfo.name}</div>
                  <Badge variant="secondary">{selectedFileInfo.type}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Size</div>
                  <div className="text-muted-foreground">
                    {formatFileSize(selectedFileInfo.size)}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Created</div>
                  <div className="text-muted-foreground">
                    {new Date(selectedFileInfo.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Modified</div>
                  <div className="text-muted-foreground">
                    {new Date(selectedFileInfo.updatedAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="font-medium">ID</div>
                  <div className="text-muted-foreground font-mono text-xs">
                    {selectedFileInfo.id}
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">Content Preview</div>
                <div className="bg-muted p-3 rounded-md text-sm max-h-32 overflow-auto">
                  {selectedFileInfo.content.substring(0, 500)}
                  {selectedFileInfo.content.length > 500 && "..."}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
