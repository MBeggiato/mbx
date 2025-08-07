import { useState } from "react";
import {
  User,
  Folder,
  Mail,
  BookOpen,
  Settings,
  Power,
  Search,
  Grid3X3,
  Clock,
  Star,
  Download,
  Gamepad2,
  Music,
  Image,
  Calculator,
  Chrome,
  Monitor,
  HardDrive,
  Edit,
  GitBranch,
} from "lucide-react";

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleWindow: (windowId: string) => void;
}

const apps = [
  { id: "about", name: "About Me", icon: User, category: "Personal" },
  { id: "projects", name: "My Projects", icon: Folder, category: "Work" },
  { id: "contact", name: "Contact", icon: Mail, category: "Personal" },
  { id: "guestbook", name: "Guest Book", icon: BookOpen, category: "Social" },
  { id: "admin", name: "Admin Panel", icon: Settings, category: "System" },
];

const systemApps = [
  { id: "calculator", name: "Calculator", icon: Calculator, category: "Tools" },
  {
    id: "changelog",
    name: "Changelog",
    icon: GitBranch,
    category: "System",
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    category: "System",
  },
  {
    id: "markdown",
    name: "Markdown Editor",
    icon: Edit,
    category: "Tools",
  },
  {
    id: "filebrowser",
    name: "File Browser",
    icon: HardDrive,
    category: "Files",
  },
  { id: "musicpro", name: "Music Player Pro", icon: Music, category: "Media" },
  { id: "photos", name: "Photo Viewer", icon: Image, category: "Media" },
  { id: "games", name: "Games", icon: Gamepad2, category: "Entertainment" },
  { id: "browser", name: "Browser", icon: Chrome, category: "Internet" },
  { id: "downloads", name: "Downloads", icon: Download, category: "Files" },
];

const quickActions = [
  { name: "Settings", icon: Settings },
  { name: "Power", icon: Power },
  { name: "Display", icon: Monitor },
];

export default function StartMenu({
  isOpen,
  onClose,
  onToggleWindow,
}: StartMenuProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSystemApps = systemApps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Start Menu */}
      <div className="fixed bottom-28 left-1/2 transform -translate-x-1/2 z-50">
        <div className="start-menu bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 w-96 max-h-[600px] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <img
                  src="https://avatars.githubusercontent.com/u/15524763?v=4"
                  alt="Marcel Beggiato"
                  className="w-full h-full object-cover rounded-4xl"
                />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Marcel</h3>
                <p className="text-sm text-muted-foreground">
                  Developer & Creator
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search apps and files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {/* Pinned Apps */}
            {filteredApps.length > 0 && (
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <h4 className="font-medium text-foreground text-sm">
                    Pinned
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {filteredApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        onToggleWindow(app.id);
                        onClose();
                      }}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <app.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground text-sm truncate">
                          {app.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {app.category}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Apps */}
            {filteredSystemApps.length > 0 && (
              <div className="p-4 border-t border-border">
                <div className="flex items-center space-x-2 mb-3">
                  <Grid3X3 className="w-4 h-4 text-blue-500" />
                  <h4 className="font-medium text-foreground text-sm">
                    Recommended
                  </h4>
                </div>
                <div className="space-y-1">
                  {filteredSystemApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        onToggleWindow(app.id);
                        onClose();
                      }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors text-left w-full"
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded flex items-center justify-center flex-shrink-0">
                        <app.icon className="w-3 h-3 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground text-sm truncate">
                          {app.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {app.category}
                        </p>
                      </div>
                      <Clock className="w-3 h-3 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchQuery &&
              filteredApps.length === 0 &&
              filteredSystemApps.length === 0 && (
                <div className="p-8 text-center">
                  <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">
                    No results found for "{searchQuery}"
                  </p>
                </div>
              )}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                    title={action.name}
                  >
                    <action.icon className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                All apps →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
