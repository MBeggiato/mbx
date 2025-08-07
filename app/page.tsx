"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ModernWindow, { WindowState } from "@/components/ModernWindow";
import Desktop from "@/components/Desktop";
import Taskbar from "@/components/Taskbar";
import Background from "@/components/Background";
import StartMenu from "@/components/StartMenu";
import AboutApp from "@/components/apps/AboutApp";
import ProjectsApp from "@/components/apps/ProjectsApp";
import ContactApp from "@/components/apps/ContactApp";
import GuestbookApp from "@/components/apps/GuestbookApp";
import CalculatorApp from "@/components/apps/CalculatorApp";
import MusicPlayerAppPro from "@/components/apps/MusicPlayerAppPro";
import PhotoViewerApp from "@/components/apps/PhotoViewerApp";
import GamesApp from "@/components/apps/GamesApp";
import BrowserApp from "@/components/apps/BrowserApp";
import DownloadsApp from "@/components/apps/DownloadsApp";
import SecretApp from "@/components/apps/SecretApp";
import MarkdownEditorApp from "@/components/apps/MarkdownEditorApp";
import FileBrowserApp from "@/components/apps/FileBrowserApp";
import ChangelogApp from "@/components/apps/ChangelogApp";
import SettingsApp from "@/components/apps/SettingsApp";

export default function ModernOSHomepage() {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  // Easter Egg States
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const [isPartyMode, setIsPartyMode] = useState(false);
  const [showSecretMessage, setShowSecretMessage] = useState(false);
  const [isNeonMode, setIsNeonMode] = useState(false);

  const [windowStates, setWindowStates] = useState<Record<string, WindowState>>(
    {
      about: {
        position: { x: 100, y: 80 },
        size: { width: 600, height: 500 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 20,
      },
      projects: {
        position: { x: 200, y: 120 },
        size: { width: 700, height: 600 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 19,
      },
      contact: {
        position: { x: 300, y: 160 },
        size: { width: 550, height: 450 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 18,
      },
      guestbook: {
        position: { x: 150, y: 100 },
        size: { width: 650, height: 550 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 17,
      },
      calculator: {
        position: { x: 400, y: 200 },
        size: { width: 350, height: 500 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 16,
      },
      changelog: {
        position: { x: 250, y: 150 },
        size: { width: 800, height: 650 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 15,
      },
      settings: {
        position: { x: 300, y: 100 },
        size: { width: 900, height: 700 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 14,
      },
      musicpro: {
        position: { x: 300, y: 180 },
        size: { width: 650, height: 750 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 14,
      },
      photos: {
        position: { x: 180, y: 120 },
        size: { width: 800, height: 600 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 13,
      },
      games: {
        position: { x: 160, y: 100 },
        size: { width: 600, height: 500 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 12,
      },
      browser: {
        position: { x: 120, y: 80 },
        size: { width: 900, height: 700 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 11,
      },
      downloads: {
        position: { x: 220, y: 140 },
        size: { width: 750, height: 550 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 10,
      },
      secret: {
        position: { x: 400, y: 250 },
        size: { width: 500, height: 400 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 30,
      },
      filebrowser: {
        position: { x: 300, y: 200 },
        size: { width: 800, height: 600 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 9,
      },
      markdown: {
        position: { x: 280, y: 180 },
        size: { width: 950, height: 700 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 8,
      },
    }
  );
  const [nextZIndex, setNextZIndex] = useState(21);

  // Ref to track last URL update time to prevent excessive history API calls
  const lastUrlUpdateRef = useRef<number>(0);

  // Easter Egg: Konami Code Detection
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // Konami Code Detection
      const newSequence = [...konamiSequence, event.code].slice(-10);
      setKonamiSequence(newSequence);

      if (JSON.stringify(newSequence) === JSON.stringify(konamiCode)) {
        setIsMatrixMode(true);
        setShowSecretMessage(true);
        setTimeout(() => setShowSecretMessage(false), 3000);
        console.log("🎉 Konami Code activated! Welcome to the Matrix!");
      }

      // Easter Egg: Ctrl + Alt + D (Desktop flip)
      if (event.ctrlKey && event.altKey && event.key === "d") {
        event.preventDefault();
        document.body.style.transform =
          document.body.style.transform === "rotate(180deg)"
            ? ""
            : "rotate(180deg)";
        document.body.style.transition = "transform 1s ease";
        setTimeout(() => {
          document.body.style.transform = "";
        }, 3000);
      }

      // Easter Egg: Shift + Ctrl + P (Party Mode)
      if (event.shiftKey && event.ctrlKey && event.key === "P") {
        event.preventDefault();
        setIsPartyMode(!isPartyMode);
      }

      // Easter Egg: Neon Mode (Ctrl + N)
      if (event.ctrlKey && event.key === "n") {
        event.preventDefault();
        setIsNeonMode(!isNeonMode);
      }

      // Easter Egg: Secret Quote (Ctrl + Q)
      if (event.ctrlKey && event.key === "q") {
        event.preventDefault();
        const secretQuotes = [
          "✨ The secret is not to give up!",
          "🌟 You've unlocked a hidden message!",
          "🎭 Code is art, and you're the artist!",
          "🚀 Keep exploring - more secrets await!",
          "💎 You found a rare easter egg!",
        ];
        const quote =
          secretQuotes[Math.floor(Math.random() * secretQuotes.length)];
        alert(quote);
      }
    },
    [konamiSequence, isPartyMode, isNeonMode]
  );

  // Easter Egg: Logo Click Counter
  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    /*
    if (newCount === 3) {
      alert("🎵 You found the first secret! Keep clicking...");
    } else if (newCount === 7) {
      alert("🌟 Lucky number 7! You're getting closer...");
    } else if (newCount === 10) {
      setIsPartyMode(true);
      alert("🎉 PARTY MODE ACTIVATED! 🎉");
    } else if (newCount === 15) {
      // Secret window
      if (!openWindows.includes("secret")) {
        toggleWindow("secret");
      }
      alert("🔍 Secret Console unlocked! Check your open windows!");
    } else if (newCount === 20) {
      setIsNeonMode(true);
      alert("✨ NEON MODE ACTIVATED! Welcome to the cyber future!");
    }

    // Reset counter after 25 clicks
    if (newCount >= 25) {
      setLogoClickCount(0);
      alert("🔄 Click counter reset! The adventure begins again...");
    }
      */
  };

  // Easter Egg: Time-based greetings
  const getTimeBasedMessage = () => {
    const hour = new Date().getHours();
    const date = new Date();
    const isAprilFools = date.getMonth() === 3 && date.getDate() === 1;

    if (isAprilFools) return "🃏 Happy April Fools! Nothing is as it seems...";
    if (hour >= 2 && hour < 6) return "🌙 Working late? Don't forget to rest!";
    if (hour >= 23 || hour < 2) return "🦉 Night owl mode activated!";
    return null;
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    // Easter Egg: Console welcome message
    console.log(`
    🎉 Welcome to Mbx Homepage! 🎉
    
    🕵️ Hey there, fellow developer! You found the console!
    
    🥚 Here are some easter eggs to try:
    • Konami Code: ↑↑↓↓←→←→BA (Matrix Mode)
    • Ctrl+Alt+D (desktop flip)
    • Ctrl+N (neon mode)
    • Right-click the hidden file in Downloads
    • Click the start button 15 times
    
    🚀 Happy exploring!
    `);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  // Separate useEffect for the custom event listener to avoid dependency issues
  useEffect(() => {
    const handleOpenSecretWindow = () => {
      if (!openWindows.includes("secret")) {
        setOpenWindows((prev) => [...prev, "secret"]);
        setActiveWindow("secret");
        setWindowStates((prev) => ({
          ...prev,
          secret: {
            ...prev.secret,
            isMinimized: false,
            zIndex: nextZIndex,
          },
        }));
        setNextZIndex((prev) => prev + 1);
      }
    };

    window.addEventListener("openSecretWindow", handleOpenSecretWindow);

    return () => {
      window.removeEventListener("openSecretWindow", handleOpenSecretWindow);
    };
  }, [openWindows, nextZIndex]);

  // Easter Egg: Matrix Rain Effect
  useEffect(() => {
    if (isMatrixMode) {
      const matrixInterval = setInterval(() => {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        console.log(
          `%c${randomChar}`,
          "color: #00ff00; font-family: monospace;"
        );
      }, 100);

      setTimeout(() => {
        setIsMatrixMode(false);
        clearInterval(matrixInterval);
      }, 10000);

      return () => clearInterval(matrixInterval);
    }
  }, [isMatrixMode]);

  // Easter Egg: Desktop double-click
  const handleDesktopDoubleClick = () => {
    const messages = [
      "🖥️ You found the desktop secret!",
      "💻 Double-click master detected!",
      "🎭 The desktop has secrets too...",
      "🌟 Keep exploring for more easter eggs!",
      "🔍 Try different key combinations!",
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    alert(randomMessage);
  };

  // URL State Management
  const serializeState = () => {
    const state = {
      openWindows,
      activeWindow,
      windowStates: Object.fromEntries(
        Object.entries(windowStates).filter(([key]) =>
          openWindows.includes(key)
        )
      ),
      nextZIndex,
    };
    return btoa(JSON.stringify(state));
  };

  const deserializeState = (encodedState: string) => {
    try {
      const state = JSON.parse(atob(encodedState));
      setOpenWindows(state.openWindows || []);
      setActiveWindow(state.activeWindow || null);
      setWindowStates((prev) => ({ ...prev, ...state.windowStates }));
      setNextZIndex(state.nextZIndex || 21);
    } catch (error) {
      console.warn("Failed to deserialize state from URL:", error);
    }
  };

  const copyStateURL = async () => {
    const url = new URL(window.location.href);
    if (openWindows.length > 0) {
      const stateParam = serializeState();
      url.searchParams.set("state", stateParam);
    } else {
      url.searchParams.delete("state");
    }

    try {
      await navigator.clipboard.writeText(url.toString());
      // You could add a toast notification here
      alert("Desktop state URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy URL:", err);
      // Fallback for browsers that don't support clipboard API
      prompt("Copy this URL to share your desktop state:", url.toString());
    }
  };

  const updateURL = () => {
    const now = Date.now();
    // Rate limit: only update URL once every 100ms to prevent excessive history API calls
    if (now - lastUrlUpdateRef.current < 100) {
      return;
    }
    lastUrlUpdateRef.current = now;

    if (openWindows.length > 0) {
      const stateParam = serializeState();
      const url = new URL(window.location.href);
      url.searchParams.set("state", stateParam);
      window.history.replaceState({}, "", url.toString());
    } else {
      // Remove state param when no windows are open
      const url = new URL(window.location.href);
      url.searchParams.delete("state");
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Load state from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get("state");
    if (stateParam) {
      deserializeState(stateParam);
    }
  }, []);

  // Update URL whenever state changes (throttled to prevent excessive history API calls)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateURL();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [openWindows, activeWindow, windowStates]);

  const toggleStartMenu = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
  };

  const toggleWindow = (windowId: string) => {
    // Close start menu when opening a window
    setIsStartMenuOpen(false);

    if (openWindows.includes(windowId)) {
      if (windowStates[windowId]?.isMinimized) {
        // Restore minimized window
        setWindowStates((prev) => ({
          ...prev,
          [windowId]: {
            ...prev[windowId],
            isMinimized: false,
            zIndex: nextZIndex,
          },
        }));
        setActiveWindow(windowId);
        setNextZIndex((prev) => prev + 1);
      } else {
        // Close window
        setOpenWindows(openWindows.filter((id) => id !== windowId));
        if (activeWindow === windowId) {
          setActiveWindow(openWindows.find((id) => id !== windowId) || null);
        }
      }
    } else {
      // Open window
      setOpenWindows([...openWindows, windowId]);
      setActiveWindow(windowId);
      setWindowStates((prev) => ({
        ...prev,
        [windowId]: {
          ...prev[windowId],
          isMinimized: false,
          zIndex: nextZIndex,
        },
      }));
      setNextZIndex((prev) => prev + 1);
    }
  };

  const closeWindow = (windowId: string) => {
    setOpenWindows(openWindows.filter((id) => id !== windowId));
    if (activeWindow === windowId) {
      setActiveWindow(openWindows.find((id) => id !== windowId) || null);
    }
  };

  const minimizeWindow = (windowId: string) => {
    setWindowStates((prev) => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        isMinimized: true,
      },
    }));
    if (activeWindow === windowId) {
      const nextActive = openWindows.find(
        (id) => id !== windowId && !windowStates[id]?.isMinimized
      );
      setActiveWindow(nextActive || null);
    }
  };

  const maximizeWindow = (windowId: string) => {
    setWindowStates((prev) => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        isMaximized: !prev[windowId].isMaximized,
        position: prev[windowId].isMaximized
          ? { x: 100 + Math.random() * 200, y: 80 + Math.random() * 100 }
          : { x: 0, y: 0 },
        size: prev[windowId].isMaximized
          ? { width: 600, height: 500 }
          : { width: window.innerWidth, height: window.innerHeight - 100 },
      },
    }));
    bringToFront(windowId);
  };

  const bringToFront = (windowId: string) => {
    if (windowStates[windowId]?.isMinimized) return;
    setActiveWindow(windowId);
    setWindowStates((prev) => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        zIndex: nextZIndex,
      },
    }));
    setNextZIndex((prev) => prev + 1);
  };

  const updateWindowState = (
    windowId: string,
    updates: Partial<WindowState>
  ) => {
    setWindowStates((prev) => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        ...updates,
      },
    }));
  };

  // Easter Egg: Right-click context menu (now moved to Downloads app)
  // const handleRightClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   const easter_eggs = [
  //     "🥚 You found a context menu easter egg!",
  //     "🐰 Right-click rabbit hole discovered!",
  //     "🎪 Secret menu activated!",
  //     "🕵️ Detective mode: ON",
  //     "🎭 Behind the scenes access granted!",
  //   ];
  //   const randomEgg =
  //     easter_eggs[Math.floor(Math.random() * easter_eggs.length)];

  //   if (
  //     confirm(
  //       `${randomEgg}\n\nWould you like to see all available easter eggs?`
  //     )
  //   ) {
  //     if (!openWindows.includes("secret")) {
  //       toggleWindow("secret");
  //     }
  //   }
  // };

  // Event listener for opening windows from other components
  useEffect(() => {
    const handleOpenWindow = (event: CustomEvent) => {
      const { windowId } = event.detail;
      if (windowId && !openWindows.includes(windowId)) {
        toggleWindow(windowId);
      }
    };

    window.addEventListener("openWindow", handleOpenWindow as EventListener);

    return () => {
      window.removeEventListener(
        "openWindow",
        handleOpenWindow as EventListener
      );
    };
  }, [openWindows, toggleWindow]);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden ${
        isNeonMode ? "neon-mode" : ""
      }`}
    >
      {/* Modern Wallpaper Background */}
      <Background />

      {/* Desktop Icons */}
      <Desktop
        onToggleWindow={toggleWindow}
        onDoubleClick={handleDesktopDoubleClick}
      />

      {/* Share Button */}
      {openWindows.length > 0 && (
        <button
          onClick={copyStateURL}
          className="fixed top-4 right-4 z-[9999] bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium shadow-lg transition-colors"
          title="Share desktop state"
        >
          📤 Share
        </button>
      )}

      {/* Easter Egg: Secret Message */}
      {showSecretMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] bg-black/90 text-green-400 p-6 rounded-lg border border-green-500 font-mono animate-pulse">
          <div className="text-center">
            <div className="text-2xl mb-2">🎉 KONAMI CODE ACTIVATED! 🎉</div>
            <div className="text-sm">Welcome to the Matrix...</div>
          </div>
        </div>
      )}

      {/* Easter Egg: Time-based message */}
      {getTimeBasedMessage() && (
        <div className="fixed bottom-4 left-4 z-[9999] bg-purple-600/90 text-white px-4 py-2 rounded-lg text-sm animate-bounce">
          {getTimeBasedMessage()}
        </div>
      )}

      {/* Easter Egg: Party Mode Overlay */}
      {isPartyMode && (
        <div className="fixed inset-0 pointer-events-none z-[9998]">
          <div
            className={`absolute inset-0 animate-pulse ${
              isNeonMode
                ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/30"
                : "bg-gradient-to-r from-red-500/20 to-pink-500/20"
            }`}
          ></div>
          <div
            className={`absolute top-4 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce ${
              isNeonMode ? "text-cyan-400" : ""
            }`}
          >
            {isNeonMode ? "🌈✨ CYBER PARTY! ✨🌈" : "🎉 PARTY MODE! 🎉"}
          </div>
        </div>
      )}

      {/* Easter Egg: Neon Mode CSS */}
      {isNeonMode && (
        <style jsx>{`
          .neon-mode {
            background: linear-gradient(
              45deg,
              #000428,
              #004e92,
              #009ffd,
              #00d2ff
            ) !important;
            background-size: 400% 400% !important;
            animation: neonGradient 4s ease-in-out infinite !important;
          }
          .neon-mode * {
            text-shadow: 0 0 10px #00d2ff, 0 0 20px #00d2ff, 0 0 30px #00d2ff !important;
            border-color: #00d2ff !important;
          }
          .neon-mode .bg-white {
            background: rgba(0, 210, 255, 0.1) !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid #00d2ff !important;
          }
          @keyframes neonGradient {
            0%,
            100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
        `}</style>
      )}

      {/* Easter Egg: Matrix Mode Background */}
      {isMatrixMode && (
        <div className="fixed inset-0 pointer-events-none z-[9997] bg-black/70">
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/50 to-black/50"></div>
        </div>
      )}

      {/* Windows */}
      {openWindows.includes("about") && (
        <ModernWindow
          windowId="about"
          title="About Me"
          isActive={activeWindow === "about"}
          windowState={windowStates.about}
          onClose={() => closeWindow("about")}
          onMinimize={() => minimizeWindow("about")}
          onMaximize={() => maximizeWindow("about")}
          onFocus={() => bringToFront("about")}
          onUpdateState={(updates) => updateWindowState("about", updates)}
        >
          <AboutApp />
        </ModernWindow>
      )}

      {openWindows.includes("projects") && (
        <ModernWindow
          windowId="projects"
          title="My Projects"
          isActive={activeWindow === "projects"}
          windowState={windowStates.projects}
          onClose={() => closeWindow("projects")}
          onMinimize={() => minimizeWindow("projects")}
          onMaximize={() => maximizeWindow("projects")}
          onFocus={() => bringToFront("projects")}
          onUpdateState={(updates) => updateWindowState("projects", updates)}
        >
          <ProjectsApp />
        </ModernWindow>
      )}

      {openWindows.includes("contact") && (
        <ModernWindow
          windowId="contact"
          title="Contact Information"
          isActive={activeWindow === "contact"}
          windowState={windowStates.contact}
          onClose={() => closeWindow("contact")}
          onMinimize={() => minimizeWindow("contact")}
          onMaximize={() => maximizeWindow("contact")}
          onFocus={() => bringToFront("contact")}
          onUpdateState={(updates) => updateWindowState("contact", updates)}
        >
          <ContactApp />
        </ModernWindow>
      )}

      {openWindows.includes("guestbook") && (
        <ModernWindow
          windowId="guestbook"
          title="Guest Book"
          isActive={activeWindow === "guestbook"}
          windowState={windowStates.guestbook}
          onClose={() => closeWindow("guestbook")}
          onMinimize={() => minimizeWindow("guestbook")}
          onMaximize={() => maximizeWindow("guestbook")}
          onFocus={() => bringToFront("guestbook")}
          onUpdateState={(updates) => updateWindowState("guestbook", updates)}
        >
          <GuestbookApp />
        </ModernWindow>
      )}

      {openWindows.includes("calculator") && (
        <ModernWindow
          windowId="calculator"
          title="Calculator"
          isActive={activeWindow === "calculator"}
          windowState={windowStates.calculator}
          onClose={() => closeWindow("calculator")}
          onMinimize={() => minimizeWindow("calculator")}
          onMaximize={() => maximizeWindow("calculator")}
          onFocus={() => bringToFront("calculator")}
          onUpdateState={(updates) => updateWindowState("calculator", updates)}
        >
          <CalculatorApp />
        </ModernWindow>
      )}

      {openWindows.includes("changelog") && (
        <ModernWindow
          windowId="changelog"
          title="Changelog"
          isActive={activeWindow === "changelog"}
          windowState={windowStates.changelog}
          onClose={() => closeWindow("changelog")}
          onMinimize={() => minimizeWindow("changelog")}
          onMaximize={() => maximizeWindow("changelog")}
          onFocus={() => bringToFront("changelog")}
          onUpdateState={(updates) => updateWindowState("changelog", updates)}
        >
          <ChangelogApp />
        </ModernWindow>
      )}

      {openWindows.includes("settings") && (
        <ModernWindow
          windowId="settings"
          title="Settings"
          isActive={activeWindow === "settings"}
          windowState={windowStates.settings}
          onClose={() => closeWindow("settings")}
          onMinimize={() => minimizeWindow("settings")}
          onMaximize={() => maximizeWindow("settings")}
          onFocus={() => bringToFront("settings")}
          onUpdateState={(updates) => updateWindowState("settings", updates)}
        >
          <SettingsApp />
        </ModernWindow>
      )}

      {openWindows.includes("musicpro") && (
        <ModernWindow
          windowId="musicpro"
          title="Music Player Pro"
          isActive={activeWindow === "musicpro"}
          windowState={windowStates.musicpro}
          onClose={() => closeWindow("musicpro")}
          onMinimize={() => minimizeWindow("musicpro")}
          onMaximize={() => maximizeWindow("musicpro")}
          onFocus={() => bringToFront("musicpro")}
          onUpdateState={(updates) => updateWindowState("musicpro", updates)}
        >
          <MusicPlayerAppPro />
        </ModernWindow>
      )}

      {openWindows.includes("photos") && (
        <ModernWindow
          windowId="photos"
          title="Photo Viewer"
          isActive={activeWindow === "photos"}
          windowState={windowStates.photos}
          onClose={() => closeWindow("photos")}
          onMinimize={() => minimizeWindow("photos")}
          onMaximize={() => maximizeWindow("photos")}
          onFocus={() => bringToFront("photos")}
          onUpdateState={(updates) => updateWindowState("photos", updates)}
        >
          <PhotoViewerApp />
        </ModernWindow>
      )}

      {openWindows.includes("games") && (
        <ModernWindow
          windowId="games"
          title="Game Center"
          isActive={activeWindow === "games"}
          windowState={windowStates.games}
          onClose={() => closeWindow("games")}
          onMinimize={() => minimizeWindow("games")}
          onMaximize={() => maximizeWindow("games")}
          onFocus={() => bringToFront("games")}
          onUpdateState={(updates) => updateWindowState("games", updates)}
        >
          <GamesApp />
        </ModernWindow>
      )}

      {openWindows.includes("browser") && (
        <ModernWindow
          windowId="browser"
          title="Mbx Browser"
          isActive={activeWindow === "browser"}
          windowState={windowStates.browser}
          onClose={() => closeWindow("browser")}
          onMinimize={() => minimizeWindow("browser")}
          onMaximize={() => maximizeWindow("browser")}
          onFocus={() => bringToFront("browser")}
          onUpdateState={(updates) => updateWindowState("browser", updates)}
        >
          <BrowserApp />
        </ModernWindow>
      )}

      {openWindows.includes("downloads") && (
        <ModernWindow
          windowId="downloads"
          title="Downloads"
          isActive={activeWindow === "downloads"}
          windowState={windowStates.downloads}
          onClose={() => closeWindow("downloads")}
          onMinimize={() => minimizeWindow("downloads")}
          onMaximize={() => maximizeWindow("downloads")}
          onFocus={() => bringToFront("downloads")}
          onUpdateState={(updates) => updateWindowState("downloads", updates)}
        >
          <DownloadsApp />
        </ModernWindow>
      )}

      {openWindows.includes("markdown") && (
        <ModernWindow
          windowId="markdown"
          title="Markdown Editor"
          isActive={activeWindow === "markdown"}
          windowState={windowStates.markdown}
          onClose={() => closeWindow("markdown")}
          onMinimize={() => minimizeWindow("markdown")}
          onMaximize={() => maximizeWindow("markdown")}
          onFocus={() => bringToFront("markdown")}
          onUpdateState={(updates) => updateWindowState("markdown", updates)}
        >
          <MarkdownEditorApp />
        </ModernWindow>
      )}

      {openWindows.includes("secret") && (
        <ModernWindow
          windowId="secret"
          title="🔍 Secret Console"
          isActive={activeWindow === "secret"}
          windowState={windowStates.secret}
          onClose={() => closeWindow("secret")}
          onMinimize={() => minimizeWindow("secret")}
          onMaximize={() => maximizeWindow("secret")}
          onFocus={() => bringToFront("secret")}
          onUpdateState={(updates) => updateWindowState("secret", updates)}
        >
          <SecretApp />
        </ModernWindow>
      )}

      {openWindows.includes("filebrowser") && (
        <ModernWindow
          windowId="filebrowser"
          title="📁 File Browser"
          isActive={activeWindow === "filebrowser"}
          windowState={windowStates.filebrowser}
          onClose={() => closeWindow("filebrowser")}
          onMinimize={() => minimizeWindow("filebrowser")}
          onMaximize={() => maximizeWindow("filebrowser")}
          onFocus={() => bringToFront("filebrowser")}
          onUpdateState={(updates) => updateWindowState("filebrowser", updates)}
        >
          <FileBrowserApp />
        </ModernWindow>
      )}

      {/* Modern Dock/Taskbar */}
      <Taskbar
        openWindows={openWindows}
        activeWindow={activeWindow}
        windowStates={windowStates}
        onToggleWindow={toggleWindow}
        onToggleStartMenu={toggleStartMenu}
        isStartMenuOpen={isStartMenuOpen}
        onLogoClick={handleLogoClick}
        logoClickCount={logoClickCount}
      />

      {/* Start Menu */}
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onToggleWindow={toggleWindow}
      />
    </div>
  );
}
