"use client";

import { useState, useEffect } from "react";
import ModernWindow, { WindowState } from "@/components/ModernWindow";
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  FileText,
  File,
  FileImage,
  Eye,
  Trash2,
  Clock,
  Download,
} from "lucide-react";
import {
  VirtualFile,
  loadFiles,
  deleteFile,
  formatFileSize,
  exportAllFiles,
} from "@/lib/virtualFileSystem";

type ViewMode = "grid" | "list";
type SortBy = "name" | "date" | "size" | "type";
type SortOrder = "asc" | "desc";
type FileTypeFilter = "all" | "text" | "markdown" | "json" | "other";

interface FilePickerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFileSelect: (file: VirtualFile) => void;
  title?: string;
  allowedTypes?: string[];
  currentFileId?: string | null;
  windowId?: string;
}

const defaultWindowState: WindowState = {
  position: { x: 150, y: 100 },
  size: { width: 800, height: 600 },
  isMinimized: false,
  isMaximized: false,
  zIndex: 100,
};

const FILE_TYPE_ICONS = {
  text: FileText,
  markdown: FileText,
  json: File,
  other: File,
};

const FILE_TYPE_COLORS = {
  text: "text-blue-600",
  markdown: "text-green-600",
  json: "text-orange-600",
  other: "text-gray-600",
};

export function FilePickerDialog({
  isOpen,
  onOpenChange,
  onFileSelect,
  title = "Select File",
  allowedTypes = ["text", "markdown", "json"],
  currentFileId = null,
  windowId = "file-picker",
}: FilePickerDialogProps) {
  const [files, setFiles] = useState<VirtualFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [fileTypeFilter, setFileTypeFilter] = useState<FileTypeFilter>("all");
  const [windowState, setWindowState] =
    useState<WindowState>(defaultWindowState);

  // Load files when dialog opens
  useEffect(() => {
    if (isOpen) {
      const loadedFiles = loadFiles();
      setFiles(loadedFiles);
    }
  }, [isOpen]);

  // Listen for file system changes
  useEffect(() => {
    const handleFileSystemChange = () => {
      if (isOpen) {
        const loadedFiles = loadFiles();
        setFiles(loadedFiles);
      }
    };

    window.addEventListener("virtualFileSystemChange", handleFileSystemChange);
    return () =>
      window.removeEventListener(
        "virtualFileSystemChange",
        handleFileSystemChange
      );
  }, [isOpen]);

  // Filter and sort files
  const filteredAndSortedFiles = files
    .filter((file) => {
      // Apply type restrictions
      if (!allowedTypes.includes(file.type)) return false;

      // Apply text filter
      const matchesSearch =
        !searchTerm ||
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.content.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply type filter
      const matchesType =
        fileTypeFilter === "all" || file.type === fileTypeFilter;

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

  const handleFileClick = (file: VirtualFile) => {
    onFileSelect(file);
    onOpenChange(false);
  };

  const handleDeleteFile = (fileId: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      deleteFile(fileId);
      const updatedFiles = loadFiles();
      setFiles(updatedFiles);
    }
  };

  const handleExportAll = () => {
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
  };

  const FileCard = ({ file }: { file: VirtualFile }) => {
    const Icon = FILE_TYPE_ICONS[file.type] || File;
    const isSelected = currentFileId === file.id;

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected
                ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                : "hover:bg-muted/50"
            }`}
            onClick={() => handleFileClick(file)}
          >
            <CardContent className="p-2">
              {viewMode === "grid" ? (
                <div className="text-center">
                  <Icon
                    className={`h-6 w-6 mx-auto mb-1 ${
                      FILE_TYPE_COLORS[file.type]
                    }`}
                  />
                  <div
                    className="text-xs font-medium truncate"
                    title={file.name}
                  >
                    {file.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {file.type}
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Icon
                    className={`h-4 w-4 ${
                      FILE_TYPE_COLORS[file.type]
                    } flex-shrink-0`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-sm">
                      {file.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {file.content.substring(0, 40)}
                      {file.content.length > 40 && "..."}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => handleFileClick(file)}>
            <Eye className="h-4 w-4 mr-2" />
            Open
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => handleDeleteFile(file.id)}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleMinimize = () => {
    setWindowState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  const handleMaximize = () => {
    setWindowState((prev) => ({ ...prev, isMaximized: !prev.isMaximized }));
  };

  const updateWindowState = (updates: Partial<WindowState>) => {
    setWindowState((prev) => ({ ...prev, ...updates }));
  };

  if (!isOpen) return null;

  return (
    <ModernWindow
      windowId={windowId}
      title={title}
      isActive={true}
      windowState={windowState}
      onClose={handleClose}
      onMinimize={handleMinimize}
      onMaximize={handleMaximize}
      onFocus={() => {}}
      onUpdateState={updateWindowState}
    >
      <div className="flex flex-col h-full bg-background">
        {/* Header with title and file count */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{title}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {filteredAndSortedFiles.length} files
          </Badge>
        </div>

        <div className="px-4 py-3 space-y-3">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>

              <Select
                value={fileTypeFilter}
                onValueChange={(value: FileTypeFilter) =>
                  setFileTypeFilter(value)
                }
              >
                <SelectTrigger className="w-20 sm:w-24 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {allowedTypes.includes("text") && (
                    <SelectItem value="text">Text</SelectItem>
                  )}
                  {allowedTypes.includes("markdown") && (
                    <SelectItem value="markdown">MD</SelectItem>
                  )}
                  {allowedTypes.includes("json") && (
                    <SelectItem value="json">JSON</SelectItem>
                  )}
                  {allowedTypes.includes("other") && (
                    <SelectItem value="other">Other</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-1">
              {/* View Mode Toggle */}
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-9 w-9 p-0 rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-9 w-9 p-0 rounded-l-none border-l"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 px-3">
                    {sortOrder === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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

          {/* File Grid/List */}
          <div className="flex-1 overflow-auto min-h-0">
            {filteredAndSortedFiles.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {searchTerm || fileTypeFilter !== "all" ? (
                  <div>
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No files found</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setSearchTerm("");
                        setFileTypeFilter("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div>
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No files found</p>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
                    : "space-y-1"
                }
              >
                {filteredAndSortedFiles.map((file) => (
                  <FileCard key={file.id} file={file} />
                ))}
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2 mt-2">
            <span>{filteredAndSortedFiles.length} files</span>
            {currentFileId && (
              <span className="truncate max-w-[200px]">
                Current:{" "}
                {files.find((f) => f.id === currentFileId)?.name || "None"}
              </span>
            )}
          </div>
        </div>
      </div>
    </ModernWindow>
  );
}
