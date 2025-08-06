import { useState } from "react";
import {
  Chrome,
  Globe,
  BookmarkIcon,
  History,
  Download,
  Shield,
  Settings,
} from "lucide-react";

const bookmarks = [
  { name: "Google", url: "https://google.com" },
  { name: "GitHub", url: "https://github.com" },
  { name: "Stack Overflow", url: "https://stackoverflow.com" },
  { name: "MDN Web Docs", url: "https://developer.mozilla.org" },
];

const history = [
  {
    title: "React Documentation",
    url: "https://react.dev",
    time: "2 hours ago",
  },
  {
    title: "TypeScript Handbook",
    url: "https://typescriptlang.org",
    time: "3 hours ago",
  },
  { title: "Next.js Guide", url: "https://nextjs.org", time: "5 hours ago" },
  { title: "Tailwind CSS", url: "https://tailwindcss.com", time: "1 day ago" },
];

export default function BrowserApp() {
  const [currentUrl, setCurrentUrl] = useState("https://marcel-mbx.dev");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "browser" | "bookmarks" | "history" | "downloads"
  >("browser");

  const navigate = (url: string) => {
    setIsLoading(true);
    setCurrentUrl(url);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const url = formData.get("url") as string;
    if (url) {
      navigate(url.startsWith("http") ? url : `https://${url}`);
    }
  };

  return (
    <div className="h-full bg-gray-100 flex flex-col">
      {/* Browser Header */}
      <div className="bg-white border-b border-gray-200 p-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Chrome className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Mbx Browser</h2>
          </div>

          <div className="flex-1 max-w-2xl">
            <form onSubmit={handleUrlSubmit} className="flex items-center">
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="url"
                  type="text"
                  defaultValue={currentUrl}
                  placeholder="Enter URL or search..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go
              </button>
            </form>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
              <BookmarkIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
              <Shield className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mt-3 bg-gray-100 rounded-lg p-1">
          {(["browser", "bookmarks", "history", "downloads"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {activeTab === "browser" && (
          <div className="h-full flex items-center justify-center bg-white">
            {isLoading ? (
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading {currentUrl}...</p>
              </div>
            ) : (
              <div className="text-center max-w-md">
                <Globe className="w-24 h-24 text-blue-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome to Mbx Browser
                </h3>
                <p className="text-gray-600 mb-4">
                  Enter a URL in the address bar above to browse the web, or
                  choose from your bookmarks.
                </p>
                <div className="text-sm text-gray-500">
                  Currently viewing:{" "}
                  <span className="font-mono">{currentUrl}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "bookmarks" && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Bookmarks
            </h3>
            <div className="grid gap-3">
              {bookmarks.map((bookmark, index) => (
                <button
                  key={index}
                  onClick={() => navigate(bookmark.url)}
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <BookmarkIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {bookmark.name}
                    </div>
                    <div className="text-sm text-gray-500">{bookmark.url}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Browsing History
            </h3>
            <div className="space-y-3">
              {history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.url)}
                  className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <History className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500">{item.url}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">{item.time}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "downloads" && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Downloads
            </h3>
            <div className="text-center py-12">
              <Download className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No downloads yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Downloaded files will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
