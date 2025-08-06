import { useState, useRef, useEffect } from "react";
import {
  Music,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  ExternalLink,
  Maximize2,
  Minimize2,
} from "lucide-react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

// Add your music files to public/music/ and list them here
type Track = {
  id: number;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  url: string;
  artistUrl?: string; // Optional URL to artist's page/website
};

const sampleTracks: Track[] = [
  // Uncomment and modify these examples when you add music files:
  {
    id: 1,
    title: "Lofi Study - Calm Peaceful Chill Hop",
    artist: "Music by FASSounds from Pixabay",
    duration: "0:00",
    cover: "https://cdn.pixabay.com/audio/2022/05/27/23-51-43-941_200x200.jpg",
    url: "/music/lofi-study-calm-peaceful-chill-hop-112191.mp3", // Place your music files in public/music/
    artistUrl: "https://pixabay.com/users/fassounds-3433550/", // Optional artist page
  },
  {
    id: 2,
    title: "Good Night - Lofi Cozy Chill Music",
    artist: "Music by FASSounds from Pixabay",
    duration: "0:00",
    cover: "https://cdn.pixabay.com/audio/2022/05/27/23-51-43-941_200x200.jpg",
    url: "/music/good-night-lofi-cozy-chill-music-160166.mp3",
    artistUrl: "https://pixabay.com/users/fassounds-3433550/", // Optional artist page
  },
  // {
  //   id: 2,
  //   title: "Example Song 2",
  //   artist: "Artist Name",
  //   duration: "0:00",
  //   cover: "/placeholder.jpg",
  //   url: "/music/song2.mp3",
  //   artistUrl: "https://artist-website.com", // Optional artist URL
  // },
];

export default function MusicPlayerAppPro() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(75); // Volume state (0-100)
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffleHistory, setShuffleHistory] = useState<number[]>([]); // Track shuffle history
  const [autoResume, setAutoResume] = useState(true); // Setting to control auto-resume
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Track if all data has been loaded from storage
  const [isVolumeLoaded, setIsVolumeLoaded] = useState(false); // Track if volume has been loaded from storage
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false); // Track fullscreen mode

  const audioPlayerRef = useRef<any>(null);

  const track = sampleTracks.length > 0 ? sampleTracks[currentTrack] : null;

  // Load fullscreen preference only - no automatic detection
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFullscreen = localStorage.getItem("musicPlayerProFullscreen");
      if (savedFullscreen !== null) {
        setIsFullscreen(savedFullscreen === "true");
      } else {
        // Default to normal view if no preference is saved
        setIsFullscreen(false);
      }
    }
  }, []);

  // Save fullscreen preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("musicPlayerProFullscreen", isFullscreen.toString());
    }
  }, [isFullscreen]);

  // Load all data from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load volume first
      const savedVolume = localStorage.getItem("musicPlayerProVolume");
      console.log("Loading saved volume:", savedVolume);
      if (savedVolume) {
        const volumeValue = parseInt(savedVolume, 10);
        if (volumeValue >= 0 && volumeValue <= 100) {
          console.log("Setting volume to saved value:", volumeValue);
          setVolume(volumeValue);
        }
      }
      // Always set volume as loaded after processing (or not finding) saved volume
      setIsVolumeLoaded(true);

      // Load auto-resume setting
      const savedAutoResume = localStorage.getItem("musicPlayerProAutoResume");
      console.log("Loading auto-resume setting:", savedAutoResume);
      if (savedAutoResume !== null) {
        setAutoResume(savedAutoResume === "true");
      }

      // Load current track
      const savedTrack = localStorage.getItem("musicPlayerProCurrentTrack");
      console.log("Loading saved track:", savedTrack);
      if (savedTrack && sampleTracks.length > 0) {
        const trackIndex = parseInt(savedTrack, 10);
        if (trackIndex >= 0 && trackIndex < sampleTracks.length) {
          console.log("Setting track to saved value:", trackIndex);
          setCurrentTrack(trackIndex);
        }
      }

      setIsDataLoaded(true);
    }
  }, [sampleTracks.length]);

  // Save volume to localStorage when it changes (but not on initial load)
  useEffect(() => {
    if (isVolumeLoaded && typeof window !== "undefined") {
      console.log("Saving volume to localStorage:", volume);
      localStorage.setItem("musicPlayerProVolume", volume.toString());
    }
  }, [volume, isVolumeLoaded]);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (isDataLoaded && typeof window !== "undefined") {
      localStorage.setItem("musicPlayerProAutoResume", autoResume.toString());
    }
  }, [autoResume, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded && typeof window !== "undefined") {
      localStorage.setItem(
        "musicPlayerProCurrentTrack",
        currentTrack.toString()
      );
    }
  }, [currentTrack, isDataLoaded]);

  // Handle auto-resume
  useEffect(() => {
    if (
      isDataLoaded &&
      autoResume &&
      audioPlayerRef.current &&
      audioPlayerRef.current.audio &&
      audioPlayerRef.current.audio.current &&
      typeof window !== "undefined"
    ) {
      const savedTime = localStorage.getItem("musicPlayerProCurrentTime");
      if (savedTime) {
        const timeValue = parseFloat(savedTime);
        if (timeValue > 3) {
          // Auto-resume if more than 3 seconds
          setTimeout(() => {
            if (audioPlayerRef.current?.audio?.current) {
              audioPlayerRef.current.audio.current.currentTime = timeValue;
              audioPlayerRef.current.audio.current
                .play()
                .catch((error: any) => {
                  console.log("Auto-play blocked by browser:", error);
                });
            }
          }, 500);
        }
      }
    }
  }, [currentTrack, isDataLoaded, autoResume]);

  // Update volume when volume state changes or audio player is ready
  useEffect(() => {
    if (audioPlayerRef.current?.audio?.current && isVolumeLoaded) {
      audioPlayerRef.current.audio.current.volume = volume / 100;
      console.log("Setting audio volume to:", volume / 100);
    }
  }, [volume, isVolumeLoaded]);

  // Also set volume when audio loads
  useEffect(() => {
    const handleLoadedData = () => {
      if (audioPlayerRef.current?.audio?.current && isVolumeLoaded) {
        audioPlayerRef.current.audio.current.volume = volume / 100;
        console.log("Setting audio volume on load to:", volume / 100);
      }
    };

    if (audioPlayerRef.current?.audio?.current) {
      const audio = audioPlayerRef.current.audio.current;
      audio.addEventListener("loadeddata", handleLoadedData);

      return () => {
        audio.removeEventListener("loadeddata", handleLoadedData);
      };
    }
  }, [volume, isVolumeLoaded]);

  const getNextShuffleTrack = () => {
    if (sampleTracks.length <= 1) return 0;

    // If we've played all tracks, reset history
    if (shuffleHistory.length >= sampleTracks.length - 1) {
      setShuffleHistory([]);
    }

    // Get available tracks (not in history and not current)
    const availableTracks = sampleTracks
      .map((_, index) => index)
      .filter(
        (index) => index !== currentTrack && !shuffleHistory.includes(index)
      );

    if (availableTracks.length === 0) {
      // Fallback to any track except current
      const fallbackTracks = sampleTracks
        .map((_, index) => index)
        .filter((index) => index !== currentTrack);
      return (
        fallbackTracks[Math.floor(Math.random() * fallbackTracks.length)] || 0
      );
    }

    return availableTracks[Math.floor(Math.random() * availableTracks.length)];
  };

  const nextTrack = () => {
    if (sampleTracks.length === 0) return;

    let nextIndex;
    if (shuffle) {
      nextIndex = getNextShuffleTrack();
      setShuffleHistory((prev) => [...prev, currentTrack]);
    } else {
      nextIndex = (currentTrack + 1) % sampleTracks.length;
    }

    setCurrentTrack(nextIndex);

    // Clear saved time when manually changing tracks
    if (typeof window !== "undefined") {
      localStorage.removeItem("musicPlayerProCurrentTime");
    }
  };

  const prevTrack = () => {
    if (sampleTracks.length === 0) return;

    let prevIndex;
    if (shuffle) {
      prevIndex = getNextShuffleTrack();
      setShuffleHistory((prev) => [...prev, currentTrack]);
    } else {
      prevIndex =
        (currentTrack - 1 + sampleTracks.length) % sampleTracks.length;
    }

    setCurrentTrack(prevIndex);

    // Clear saved time when manually changing tracks
    if (typeof window !== "undefined") {
      localStorage.removeItem("musicPlayerProCurrentTime");
    }
  };

  const handleTrackSelect = (index: number) => {
    if (sampleTracks.length === 0) return;

    setCurrentTrack(index);
    setShuffleHistory([]); // Reset shuffle history on manual selection

    // Clear saved time when manually selecting a new track
    if (typeof window !== "undefined") {
      localStorage.removeItem("musicPlayerProCurrentTime");
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  // Event handlers for the audio player
  const handlePlay = () => {
    console.log("Playing track:", track?.title);
  };

  const handlePause = () => {
    console.log("Paused track:", track?.title);
  };

  const handleEnded = () => {
    if (repeat) {
      // Repeat current song - the player will handle this automatically if we don't change track
      return;
    } else if (sampleTracks.length > 1) {
      // Auto-play next track
      nextTrack();
    }
  };

  const handleListen = (e: any) => {
    // Save current time periodically
    if (typeof window !== "undefined" && e.target.currentTime > 0) {
      localStorage.setItem(
        "musicPlayerProCurrentTime",
        e.target.currentTime.toString()
      );
    }
  };

  const handleVolumeChange = (e: any) => {
    // Sync volume changes from the audio player to our state
    const newVolume = Math.round(e.target.volume * 100);
    if (newVolume !== volume) {
      console.log("Volume changed by audio player to:", newVolume);
      setVolume(newVolume);
    }
  };

  // Custom styles for the audio player
  const playerStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    border: "none",
  };

  return (
    <div
      className="p-3 sm:p-6 h-full bg-gradient-to-br from-purple-50 to-pink-50 overflow-y-auto flex flex-col"
      style={{
        minWidth: "730px",
        minHeight: "525px",
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4 sm:gap-0 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Music className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Music Player Pro
          </h2>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="ml-2 p-1.5 rounded-lg hover:bg-purple-100 text-purple-600 transition-colors"
            title={
              isFullscreen
                ? "Switch to compact view"
                : "Switch to fullscreen view"
            }
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          {isFullscreen && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              Fullscreen View
            </span>
          )}
        </div>

        {/* Auto-Resume Setting */}
        <div className="flex items-center space-x-2 text-sm">
          <label
            className="text-sm text-gray-600 cursor-pointer"
            htmlFor="auto-resume-pro"
          >
            Auto-resume
          </label>
          <input
            id="auto-resume-pro"
            type="checkbox"
            checked={autoResume}
            onChange={(e) => setAutoResume(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
            title={
              autoResume
                ? "Disable auto-resume of tracks"
                : "Enable auto-resume of tracks"
            }
          />
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                console.log("LocalStorage state:", {
                  volume: localStorage.getItem("musicPlayerProVolume"),
                  autoResume: localStorage.getItem("musicPlayerProAutoResume"),
                  currentTrack: localStorage.getItem(
                    "musicPlayerProCurrentTrack"
                  ),
                  currentTime: localStorage.getItem(
                    "musicPlayerProCurrentTime"
                  ),
                });
              }
            }}
            className="text-xs text-gray-400 hover:text-gray-600 ml-2 hidden"
            title="Log localStorage state to console"
          >
            Debug
          </button>
        </div>
      </div>

      {sampleTracks.length === 0 ? (
        <div className="text-center py-8 sm:py-12 flex-1 flex items-center justify-center">
          <div>
            <Music className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              No Music Found
            </h3>
            <p className="text-gray-500 mb-4 px-4 text-sm sm:text-base">
              Add music files to the source code
            </p>
            <p className="text-xs sm:text-sm text-gray-400 px-4">
              Edit{" "}
              <code className="bg-gray-100 px-1 rounded">sampleTracks</code>{" "}
              array in the component
            </p>
          </div>
        </div>
      ) : isFullscreen ? (
        // Fullscreen Layout: Playlist + Bottom Player Bar
        <div className="flex-1 flex flex-col">
          {/* Playlist Area */}
          <div className="flex-1 overflow-y-auto mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Playlist ({sampleTracks.length}{" "}
              {sampleTracks.length === 1 ? "song" : "songs"})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sampleTracks.map((trackItem, index) => (
                <div
                  key={trackItem.id}
                  onClick={() => handleTrackSelect(index)}
                  className={`group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${
                    index === currentTrack
                      ? "ring-2 ring-purple-500 bg-purple-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {/* Album Art */}
                  <div className="aspect-square relative">
                    {trackItem.cover ? (
                      <img
                        src={trackItem.cover}
                        alt={`${trackItem.title} cover`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                        <Music className="w-12 h-12 text-white opacity-50" />
                      </div>
                    )}
                    {index === currentTrack && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    )}
                    {/* Play overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-200">
                        <div className="w-0 h-0 border-l-[8px] border-l-purple-600 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Track Info */}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 truncate mb-1">
                      {trackItem.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        {trackItem.artistUrl ? (
                          <a
                            href={trackItem.artistUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-600 hover:text-purple-600 transition-colors flex items-center space-x-1 group/artist relative z-20 cursor-pointer truncate"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="truncate">{trackItem.artist}</span>
                            <ExternalLink className="w-3 h-3 opacity-60 group-hover/artist:opacity-100 transition-opacity flex-shrink-0" />
                          </a>
                        ) : (
                          <p className="text-sm text-gray-600 truncate">
                            {trackItem.artist}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {trackItem.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Player Bar */}
          <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 rounded-t-2xl p-4 flex-shrink-0">
            <div className="flex items-center space-x-4">
              {/* Current Track Info */}
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  {track?.cover && !imageError ? (
                    <img
                      src={track.cover}
                      alt={`${track.title} cover`}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  ) : (
                    <Music className="w-8 h-8 text-white opacity-50" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {track?.title || "No Track"}
                  </h4>
                  <div className="flex items-center space-x-1">
                    {track?.artistUrl ? (
                      <a
                        href={track.artistUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-purple-600 transition-colors flex items-center space-x-1 group/artist relative z-20 cursor-pointer truncate"
                      >
                        <span className="truncate">{track.artist}</span>
                        <ExternalLink className="w-3 h-3 opacity-60 group-hover/artist:opacity-100 transition-opacity flex-shrink-0" />
                      </a>
                    ) : (
                      <p className="text-sm text-gray-600 truncate">
                        {track?.artist || "Unknown Artist"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setShuffle(!shuffle);
                    setShuffleHistory([]);
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    shuffle
                      ? "text-purple-600 bg-purple-100"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title={shuffle ? "Disable shuffle" : "Enable shuffle"}
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <button
                  onClick={prevTrack}
                  className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  disabled={sampleTracks.length === 0}
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={nextTrack}
                  className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  disabled={sampleTracks.length === 0}
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setRepeat(!repeat)}
                  className={`p-2 rounded-full transition-colors ${
                    repeat
                      ? "text-purple-600 bg-purple-100"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title={repeat ? "Disable repeat" : "Enable repeat"}
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Audio Player */}
              <div className="flex-1 max-w-md">
                <AudioPlayer
                  ref={audioPlayerRef}
                  src={track?.url || ""}
                  autoPlay={false}
                  loop={repeat}
                  volume={volume / 100}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onEnded={handleEnded}
                  onListen={handleListen}
                  onVolumeChange={handleVolumeChange}
                  listenInterval={1000}
                  showSkipControls={false}
                  showJumpControls={false}
                  style={{
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    border: "none",
                    fontSize: "0.875rem",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Normal Layout: Original design with minimum size
        <div className="w-full max-w-2xl mx-auto flex-1">
          {/* Main Content - Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
            {/* Left Column - Album Art and Track Info */}
            <div className="flex flex-col items-center">
              {/* Album Art */}
              <div className="relative mb-4 sm:mb-6">
                <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-56 lg:h-56 xl:w-64 xl:h-64 mx-auto bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 overflow-hidden">
                  {track?.cover && !imageError ? (
                    <>
                      <img
                        src={track.cover}
                        alt={`${track.title} cover`}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                          imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                      {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Music className="w-16 h-16 sm:w-24 sm:h-24 text-white opacity-50" />
                  )}
                </div>
              </div>

              {/* Track Info */}
              <div className="text-center mb-4 sm:mb-6 px-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 break-words">
                  {track?.title || "No Track"}
                </h3>
                <div className="flex items-center justify-center space-x-2">
                  {track?.artistUrl ? (
                    <a
                      href={track.artistUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-purple-600 transition-colors flex items-center space-x-1 group relative z-20 cursor-pointer text-sm sm:text-base break-words text-center"
                    >
                      <span className="break-words">{track.artist}</span>
                      <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </a>
                  ) : (
                    <p className="text-gray-600 text-sm sm:text-base break-words text-center">
                      {track?.artist || "Unknown Artist"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Controls and Playlist */}
            <div className="flex flex-col">
              {/* Audio Player with react-h5-audio-player */}
              <div
                className="mb-4 sm:mb-6"
                style={{
                  fontSize: "clamp(0.75rem, 2vw, 1rem)", // Responsive font size for player
                }}
              >
                <AudioPlayer
                  ref={audioPlayerRef}
                  src={track?.url || ""}
                  autoPlay={false}
                  loop={repeat}
                  volume={volume / 100}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onEnded={handleEnded}
                  onListen={handleListen}
                  onVolumeChange={handleVolumeChange}
                  listenInterval={1000}
                  showSkipControls={false}
                  showJumpControls={true}
                  progressJumpSteps={{ backward: 5000, forward: 5000 }}
                  style={playerStyle}
                  customIcons={{
                    play: undefined, // Use default
                    pause: undefined, // Use default
                    rewind: undefined, // Use default
                    forward: undefined, // Use default
                    previous: undefined, // We handle this ourselves
                    next: undefined, // We handle this ourselves
                  }}
                />
              </div>

              {/* Custom Controls */}
              <div className="flex items-center justify-center space-x-4 sm:space-x-6 mb-4 sm:mb-6">
                <button
                  onClick={() => {
                    setShuffle(!shuffle);
                    setShuffleHistory([]); // Reset shuffle history when toggling
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    shuffle
                      ? "text-purple-600 bg-purple-100"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title={shuffle ? "Disable shuffle" : "Enable shuffle"}
                >
                  <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  onClick={prevTrack}
                  className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  disabled={sampleTracks.length === 0}
                >
                  <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* The play/pause button is handled by the AudioPlayer component */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
                  {/* Spacer for layout consistency */}
                </div>

                <button
                  onClick={nextTrack}
                  className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  disabled={sampleTracks.length === 0}
                >
                  <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <button
                  onClick={() => setRepeat(!repeat)}
                  className={`p-2 rounded-full transition-colors ${
                    repeat
                      ? "text-purple-600 bg-purple-100"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title={repeat ? "Disable repeat" : "Enable repeat"}
                >
                  <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Playlist */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base px-2 sm:px-0">
                  Playlist ({sampleTracks.length}{" "}
                  {sampleTracks.length === 1 ? "song" : "songs"})
                </h4>
                <div className="space-y-2 max-h-32 sm:max-h-40 lg:max-h-64 overflow-y-auto px-2 sm:px-0">
                  {sampleTracks.map((trackItem, index) => (
                    <div
                      key={trackItem.id}
                      onClick={() => handleTrackSelect(index)}
                      className={`flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        index === currentTrack
                          ? "bg-purple-100 text-purple-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center relative">
                        {trackItem.cover ? (
                          <>
                            <img
                              src={trackItem.cover}
                              alt={`${trackItem.title} thumbnail`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                            <Music
                              className="w-3 h-3 sm:w-4 sm:h-4 text-white opacity-50 absolute inset-0 m-auto"
                              style={{ display: "none" }}
                            />
                          </>
                        ) : (
                          <Music className="w-3 h-3 sm:w-4 sm:h-4 text-white opacity-50" />
                        )}
                        {index === currentTrack && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">
                          {trackItem.title}
                        </p>
                        <div className="flex items-center space-x-1">
                          {trackItem.artistUrl ? (
                            <a
                              href={trackItem.artistUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gray-500 hover:text-purple-600 transition-colors flex items-center space-x-1 group truncate relative z-20 cursor-pointer"
                              onClick={(e) => e.stopPropagation()} // Prevent track selection when clicking artist link
                            >
                              <span className="truncate">
                                {trackItem.artist}
                              </span>
                              <ExternalLink className="w-2 h-2 sm:w-2.5 sm:h-2.5 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            </a>
                          ) : (
                            <p className="text-xs text-gray-500 truncate">
                              {trackItem.artist}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {trackItem.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
