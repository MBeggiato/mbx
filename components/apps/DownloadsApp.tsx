import { useState, useEffect } from "react";
import {
  Download,
  File,
  Folder,
  Search,
  Grid,
  List,
  SortAsc,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Plus,
  RefreshCw,
} from "lucide-react";
import {
  VirtualFile,
  loadFiles,
  deleteFile,
  formatFileSize,
} from "@/lib/virtualFileSystem";

interface DownloadItem {
  id: number | string;
  name: string;
  size: string;
  type: string;
  date: string;
  icon: string;
  status: string;
  isSecret?: boolean;
  isVirtual?: boolean;
  virtualFile?: VirtualFile;
}

const downloads: DownloadItem[] = [
  {
    id: 1,
    name: "project-files.zip",
    size: "2.4 MB",
    type: "Archive",
    date: "2025-08-05 14:30",
    icon: "📦",
    status: "completed",
  },
  {
    id: 2,
    name: "presentation.pdf",
    size: "5.1 MB",
    type: "PDF Document",
    date: "2025-08-05 12:15",
    icon: "📄",
    status: "completed",
  },
  {
    id: 3,
    name: "music-album.mp3",
    size: "45.2 MB",
    type: "Audio",
    date: "2025-08-04 18:45",
    icon: "🎵",
    status: "completed",
  },
  {
    id: 4,
    name: "software-installer.exe",
    size: "128.7 MB",
    type: "Application",
    date: "2025-08-04 09:22",
    icon: "⚙️",
    status: "completed",
  },
  {
    id: 5,
    name: "holiday-photos.zip",
    size: "89.3 MB",
    type: "Archive",
    date: "2025-08-03 16:10",
    icon: "📸",
    status: "completed",
  },
  {
    id: 6,
    name: "document-template.docx",
    size: "1.2 MB",
    type: "Document",
    date: "2025-08-03 11:05",
    icon: "📝",
    status: "completed",
  },
  {
    id: 7,
    name: ".hidden_secrets.dat",
    size: "42 KB",
    type: "System File",
    date: "2025-01-01 00:00",
    icon: "🔒",
    status: "completed",
    isSecret: true,
  },
];

export default function DownloadsApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");
  const [showHidden, setShowHidden] = useState(false);
  const [virtualFiles, setVirtualFiles] = useState<VirtualFile[]>([]);
  const [showVirtualFiles, setShowVirtualFiles] = useState(true);

  // Load virtual files on mount and listen for changes
  useEffect(() => {
    const loadVirtualFiles = () => {
      const files = loadFiles();
      setVirtualFiles(files);
    };

    loadVirtualFiles();

    // Listen for file system changes from other apps
    const handleFileSystemChange = () => {
      loadVirtualFiles();
    };

    window.addEventListener("virtualFileSystemChange", handleFileSystemChange);

    return () => {
      window.removeEventListener(
        "virtualFileSystemChange",
        handleFileSystemChange
      );
    };
  }, []);

  // Convert VirtualFile to DownloadItem format for display
  const virtualFilesToDownloadItems = (
    files: VirtualFile[]
  ): DownloadItem[] => {
    return files.map((file) => ({
      id: file.id,
      name: file.name,
      size: formatFileSize(file.size),
      type:
        file.type === "markdown"
          ? "Markdown Document"
          : file.type === "text"
          ? "Text Document"
          : file.type === "json"
          ? "JSON File"
          : "Document",
      date: new Date(file.updatedAt)
        .toLocaleString()
        .replace(/T/, " ")
        .replace(/\..+/, ""),
      icon:
        file.type === "markdown"
          ? "📝"
          : file.type === "text"
          ? "📄"
          : file.type === "json"
          ? "🔧"
          : "📋",
      status: "mbx-file",
      isVirtual: true,
      virtualFile: file,
    }));
  };

  // Combine regular downloads with virtual files
  const allFiles = [
    ...downloads,
    ...(showVirtualFiles ? virtualFilesToDownloadItems(virtualFiles) : []),
  ];

  // Easter egg handler for the secret file
  const handleSecretFileRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const easter_eggs = [
      "🔍 You found the hidden file easter egg!",
      "🕵️ Detective skills: LEGENDARY!",
      "🎪 Secret file accessed - welcome to the hidden menu!",
      "🔒 You've unlocked the mysterious file!",
      "🎭 Behind the downloads, secrets await!",
    ];
    const randomEgg =
      easter_eggs[Math.floor(Math.random() * easter_eggs.length)];

    if (
      confirm(
        `${randomEgg}\n\nWould you like to see all available easter eggs in the Secret Console?`
      )
    ) {
      // We'll need to pass this up to the parent component
      // For now, we'll use a global event or localStorage to communicate
      window.dispatchEvent(new CustomEvent("openSecretWindow"));
    }
  };

  const filteredDownloads = allFiles
    .filter((item) => showHidden || !item.isSecret) // Filter out secret files unless showHidden is true
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return parseFloat(b.size) - parseFloat(a.size);
        case "date":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const getTotalSize = () => {
    const regularTotal = downloads.reduce((acc, item) => {
      const size = parseFloat(item.size);
      const unit = item.size.split(" ")[1];
      const multiplier = unit === "GB" ? 1024 : unit === "KB" ? 0.001 : 1;
      return acc + size * multiplier;
    }, 0);

    const virtualTotal = virtualFiles.reduce((acc, file) => {
      return acc + file.size / (1024 * 1024); // Convert bytes to MB
    }, 0);

    const total = regularTotal + virtualTotal;
    return total > 1024
      ? `${(total / 1024).toFixed(1)} GB`
      : `${total.toFixed(1)} MB`;
  };

  const openFile = (fileName: string, item?: DownloadItem) => {
    if (item?.isVirtual && item.virtualFile) {
      // Open virtual file in markdown editor
      window.dispatchEvent(
        new CustomEvent("openMarkdownFile", {
          detail: { file: item.virtualFile },
        })
      );
    } else {
      alert(`Opening ${fileName}...`);
    }
  };

  const handleDeleteFile = (id: number | string, item: DownloadItem) => {
    if (item.isVirtual && typeof id === "string") {
      // Delete virtual file
      deleteFile(id);
      // Refresh will happen automatically via the event listener
    } else {
      // Handle regular download deletion
      alert(`Deleting file with ID ${id}...`);
    }
  };

  return (
    <div className="p-6 h-full bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      <div className="flex items-center space-x-2 mb-6">
        <Download className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-900">Downloads</h2>
      </div>

      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search downloads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "name" | "date" | "size")
            }
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          {/* Show Hidden Files Toggle */}
          <button
            onClick={() => setShowHidden(!showHidden)}
            className={`px-3 py-2 rounded-lg border transition-colors text-sm flex items-center space-x-2 ${
              showHidden
                ? "bg-purple-100 border-purple-300 text-purple-700"
                : "bg-white border-gray-200 text-gray-600 hover:text-gray-900"
            }`}
            title={showHidden ? "Hide secret files" : "Show hidden files"}
          >
            {showHidden ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            <span>{showHidden ? "Hide" : "Show"} Hidden</span>
          </button>

          {/* Show Virtual Files Toggle */}
          <button
            onClick={() => setShowVirtualFiles(!showVirtualFiles)}
            className={`px-3 py-2 rounded-lg border transition-colors text-sm flex items-center space-x-2 ${
              showVirtualFiles
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-white border-gray-200 text-gray-600 hover:text-gray-900"
            }`}
            title={showVirtualFiles ? "Hide Mbx OS files" : "Show Mbx OS files"}
          >
            <FileText className="w-4 h-4" />
            <span>Mbx Files ({virtualFiles.length})</span>
          </button>

          {/* View Mode Toggle */}
          <div className="bg-white rounded-lg border border-gray-200 p-1 flex">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-green-100 text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-green-100 text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Downloads</p>
            <p className="text-2xl font-semibold text-gray-900">
              {downloads.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Mbx Files</p>
            <p className="text-2xl font-semibold text-blue-600">
              {virtualFiles.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Size</p>
            <p className="text-2xl font-semibold text-gray-900">
              {getTotalSize()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Available Space</p>
            <p className="text-2xl font-semibold text-green-600">127 GB</p>
          </div>
        </div>
      </div>

      {/* Downloads List/Grid */}
      <div className="flex-1 overflow-auto">
        {viewMode === "list" ? (
          <div className="space-y-2">
            {filteredDownloads.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg p-4 border hover:border-green-300 transition-colors ${
                  item.isSecret
                    ? "border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50"
                    : "border-gray-200"
                }`}
                onContextMenu={
                  item.isSecret ? handleSecretFileRightClick : undefined
                }
                title={
                  item.isSecret
                    ? "🔒 Secret file - right-click for surprises!"
                    : undefined
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-2xl">{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{item.type}</span>
                        <span>{item.size}</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openFile(item.name, item)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Open"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(item.id, item)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDownloads.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg p-4 border hover:border-green-300 transition-colors text-center ${
                  item.isSecret
                    ? "border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50"
                    : "border-gray-200"
                }`}
                onContextMenu={
                  item.isSecret ? handleSecretFileRightClick : undefined
                }
                title={
                  item.isSecret
                    ? "🔒 Secret file - right-click for surprises!"
                    : undefined
                }
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-medium text-gray-900 truncate mb-1">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-500 mb-1">{item.type}</p>
                <p className="text-sm text-gray-500 mb-3">{item.size}</p>
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => openFile(item.name, item)}
                    className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFile(item.id, item)}
                    className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredDownloads.length === 0 && (
          <div className="text-center py-12">
            <Download className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No downloads found</p>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your search terms
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
