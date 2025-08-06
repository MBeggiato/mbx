import { User, Folder, Mail, BookOpen, Github } from "lucide-react";

interface DesktopProps {
  onToggleWindow: (windowId: string) => void;
  onDoubleClick?: () => void;
}

export default function Desktop({
  onToggleWindow,
  onDoubleClick,
}: DesktopProps) {
  return (
    <div
      className="absolute top-8 left-8 space-y-6"
      onDoubleClick={(e) => {
        // Only trigger if clicking on empty desktop space, not on icons
        if (e.target === e.currentTarget && onDoubleClick) {
          onDoubleClick();
        }
      }}
    >
      <div
        className="flex flex-col items-center cursor-pointer group"
        onClick={() => onToggleWindow("about")}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
          <User className="w-8 h-8 text-white" />
        </div>
        <span className="text-white text-sm font-medium drop-shadow-lg">
          About Me
        </span>
      </div>

      <div
        className="flex flex-col items-center cursor-pointer group"
        onClick={() => onToggleWindow("projects")}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
          <Folder className="w-8 h-8 text-white" />
        </div>
        <span className="text-white text-sm font-medium drop-shadow-lg">
          Projects
        </span>
      </div>

      <div
        className="flex flex-col items-center cursor-pointer group"
        onClick={() => onToggleWindow("contact")}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <span className="text-white text-sm font-medium drop-shadow-lg">
          Contact
        </span>
      </div>

      <div
        className="flex flex-col items-center cursor-pointer group"
        onClick={() => onToggleWindow("guestbook")}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <span className="text-white text-sm font-medium drop-shadow-lg">
          Guest Book
        </span>
      </div>

      <div
        className="flex flex-col items-center cursor-pointer group"
        onClick={() => window.open("https://github.com/MBeggiato", "_blank")}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl shadow-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200 relative">
          <Github className="w-8 h-8 text-white" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </div>
        <span className="text-white text-sm font-medium drop-shadow-lg">
          Github
        </span>
      </div>
    </div>
  );
}
