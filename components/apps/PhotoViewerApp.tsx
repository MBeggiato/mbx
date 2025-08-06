import { useState } from "react";
import {
  Image,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Share,
  Trash2,
} from "lucide-react";

interface ImageItem {
  id: number;
  name: string;
  size: string;
  date: string;
  src: string;
  thumbnail?: string; // Optional custom thumbnail URL
}

const sampleImages: ImageItem[] = [
  {
    id: 1,
    name: "Mbx Desktop.jpg",
    size: "1920x1080",
    date: "2025-08-05",
    src: "/placeholder.jpg",
    thumbnail: "/placeholder.jpg", // Optional custom thumbnail
  },
  {
    id: 2,
    name: "Sunset Landscape.jpg",
    size: "2560x1440",
    date: "2025-08-04",
    src: "/placeholder.jpg",
    // No thumbnail specified - will use main image as fallback
  },
  {
    id: 3,
    name: "City Lights.jpg",
    size: "3840x2160",
    date: "2025-08-03",
    src: "/placeholder.jpg",
    thumbnail: "/placeholder.jpg", // Custom thumbnail for better performance
  },
  {
    id: 4,
    name: "Rick Astley.png",
    size: "800x600",
    date: "2025-08-02",
    src: "https://static.wikia.nocookie.net/4b4f252c-b83d-46c4-a890-5674da623491",
    thumbnail:
      "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
  },
];

export default function PhotoViewerApp() {
  const [currentImage, setCurrentImage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const image = sampleImages[currentImage];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % sampleImages.length);
    setZoom(100);
    setRotation(0);
    setImageLoading(false);
    setImageError(false);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + sampleImages.length) % sampleImages.length
    );
    setZoom(100);
    setRotation(0);
    setImageLoading(false);
    setImageError(false);
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 300));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const resetView = () => {
    setZoom(100);
    setRotation(0);
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                {image.name}
                {image.thumbnail && image.thumbnail !== image.src && (
                  <span
                    className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full"
                    title="Custom thumbnail available"
                  >
                    📸
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-400">
                {image.size} • {image.date}
                {image.thumbnail && (
                  <span className="ml-2 text-purple-400 text-xs">
                    • Custom thumbnail
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>

            <span className="text-gray-400 text-sm min-w-[4rem] text-center">
              {zoom}%
            </span>

            <button
              onClick={zoomIn}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            <button
              onClick={rotate}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Rotate"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-gray-600"></div>

            <button
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Share"
            >
              <Share className="w-5 h-5" />
            </button>

            <button
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Viewer */}
      <div className="flex-1 flex items-center justify-center bg-gray-900 relative overflow-hidden">
        <div
          className="transition-all duration-300 flex items-center justify-center"
          style={{
            width: `${Math.min(400 * (zoom / 100), 800)}px`,
            height: `${Math.min(300 * (zoom / 100), 600)}px`,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {image.src.startsWith("http") ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                </div>
              )}
              <img
                src={image.src}
                alt={image.name}
                className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl ${
                  imageLoading ? "opacity-0" : "opacity-100"
                } transition-opacity duration-300`}
                onLoad={() => {
                  setImageLoading(false);
                  setImageError(false);
                }}
                onLoadStart={() => {
                  setImageLoading(true);
                  setImageError(false);
                }}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
              />
              {imageError && (
                <div className="bg-gradient-to-br from-red-500 to-red-600 flex flex-col items-center justify-center w-full h-full rounded-lg">
                  <Image className="w-16 h-16 text-white opacity-75 mb-2" />
                  <p className="text-white text-sm">Failed to load image</p>
                  <p className="text-white/75 text-xs mt-1">
                    Check your connection
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center w-full h-full rounded-lg">
              <Image className="w-24 h-24 text-white opacity-50" />
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
        >
          ‹
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
        >
          ›
        </button>
      </div>

      {/* Footer with Thumbnails */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex items-center justify-center space-x-2">
          {sampleImages.map((img, index) => {
            // Use custom thumbnail if provided, otherwise use main image src
            const thumbnailSrc = img.thumbnail || img.src;

            return (
              <button
                key={img.id}
                onClick={() => {
                  setCurrentImage(index);
                  setImageLoading(false);
                  setImageError(false);
                }}
                className={`w-16 h-12 rounded overflow-hidden transition-all ${
                  index === currentImage
                    ? "ring-2 ring-blue-400"
                    : "hover:ring-1 hover:ring-gray-500"
                }`}
              >
                {thumbnailSrc.startsWith("http") ? (
                  <img
                    src={thumbnailSrc}
                    alt={img.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                            <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                    <Image className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="text-center mt-3">
          <p className="text-gray-400 text-sm">
            {currentImage + 1} of {sampleImages.length} photos
          </p>
          <button
            onClick={resetView}
            className="text-blue-400 hover:text-blue-300 text-sm mt-1 transition-colors"
          >
            Reset View
          </button>
        </div>
      </div>
    </div>
  );
}
