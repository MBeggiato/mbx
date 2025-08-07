import {
  User,
  Folder,
  Mail,
  BookOpen,
  Grid3X3,
  Search,
  Calculator,
  Music,
  Image,
  Gamepad2,
  Chrome,
  Download,
  HardDrive,
  FileText,
  Edit,
} from "lucide-react";
import { WindowState } from "./ModernWindow";

interface TaskbarProps {
  openWindows: string[];
  activeWindow: string | null;
  windowStates: Record<string, WindowState>;
  onToggleWindow: (windowId: string) => void;
  onToggleStartMenu: () => void;
  isStartMenuOpen: boolean;
  onLogoClick?: () => void;
  logoClickCount?: number;
}

export default function Taskbar({
  openWindows,
  activeWindow,
  windowStates,
  onToggleWindow,
  onToggleStartMenu,
  isStartMenuOpen,
  onLogoClick,
  logoClickCount = 0,
}: TaskbarProps) {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
      <div className="taskbar bg-background/90 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-2xl border border-border/50">
        <div className="flex items-center space-x-4">
          {/* Start Button */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-200 shadow-lg ${
              isStartMenuOpen
                ? "bg-white/30"
                : "bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            } ${logoClickCount > 0 ? "animate-pulse" : ""}`}
            onClick={(e) => {
              onToggleStartMenu();
              if (onLogoClick) {
                onLogoClick();
              }
            }}
            title={
              logoClickCount > 0
                ? `Clicked ${logoClickCount} times! 🎉`
                : "Start Menu"
            }
          >
            <Grid3X3 className="w-6 h-6 text-white" />
            {logoClickCount >= 5 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
            )}
          </div>

          {/* Search */}
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200">
            <Search className="w-6 h-6 text-white" />
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-white/30"></div>

          {/* Window Buttons */}
          {openWindows.map((windowId) => {
            const isMinimized = windowStates[windowId]?.isMinimized;
            return (
              <div
                key={windowId}
                className={`w-12 h-12 rounded-xl cursor-pointer hover:scale-105 transition-all duration-200 flex items-center justify-center relative ${
                  activeWindow === windowId && !isMinimized
                    ? "bg-white/30 shadow-lg"
                    : "bg-white/10 hover:bg-white/20"
                } ${isMinimized ? "opacity-60" : ""}`}
                onClick={() => onToggleWindow(windowId)}
              >
                {windowId === "about" && (
                  <User className="w-6 h-6 text-white" />
                )}
                {windowId === "projects" && (
                  <Folder className="w-6 h-6 text-white" />
                )}
                {windowId === "contact" && (
                  <Mail className="w-6 h-6 text-white" />
                )}
                {windowId === "guestbook" && (
                  <BookOpen className="w-6 h-6 text-white" />
                )}
                {windowId === "calculator" && (
                  <Calculator className="w-6 h-6 text-white" />
                )}
                {windowId === "music" && (
                  <Music className="w-6 h-6 text-white" />
                )}
                {windowId === "musicpro" && (
                  <Music className="w-6 h-6 text-white" />
                )}
                {windowId === "photos" && (
                  <Image className="w-6 h-6 text-white" />
                )}
                {windowId === "games" && (
                  <Gamepad2 className="w-6 h-6 text-white" />
                )}
                {windowId === "browser" && (
                  <Chrome className="w-6 h-6 text-white" />
                )}
                {windowId === "downloads" && (
                  <Download className="w-6 h-6 text-white" />
                )}
                {windowId === "filebrowser" && (
                  <HardDrive className="w-6 h-6 text-white" />
                )}
                {windowId === "markdown" && (
                  <Edit className="w-6 h-6 text-white" />
                )}
                {!isMinimized && activeWindow === windowId && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </div>
            );
          })}

          {/* Separator */}
          <div className="w-px h-8 bg-white/30"></div>

          {/* System Info */}
          <div className="text-white text-sm font-medium">
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
