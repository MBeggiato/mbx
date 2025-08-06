"use client";

import { useState } from "react";
import ModernWindow, { WindowState } from "@/components/ModernWindow";
import Desktop from "@/components/Desktop";
import Taskbar from "@/components/Taskbar";
import Background from "@/components/Background";
import AboutApp from "@/components/apps/AboutApp";
import ProjectsApp from "@/components/apps/ProjectsApp";
import ContactApp from "@/components/apps/ContactApp";
import GuestbookApp, { GuestbookEntry } from "@/components/apps/GuestbookApp";

export default function ModernOSHomepage() {
  const [openWindows, setOpenWindows] = useState<string[]>(["about"]);
  const [activeWindow, setActiveWindow] = useState("about");
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
    }
  );
  const [nextZIndex, setNextZIndex] = useState(21);
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      message: "Beautiful portfolio! Love the modern OS design concept.",
      timestamp: new Date("2024-08-01T10:30:00").toLocaleString(),
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike.chen@example.com",
      message: "Really impressive work! The window management is so smooth.",
      timestamp: new Date("2024-08-03T14:15:00").toLocaleString(),
    },
    {
      id: 3,
      name: "Alex Rivera",
      email: "alex@example.com",
      message: "This is awesome! Can't wait to see more projects like this.",
      timestamp: new Date("2024-08-04T16:45:00").toLocaleString(),
    },
  ]);

  const addGuestbookEntry = (entry: GuestbookEntry) => {
    setGuestbookEntries([entry, ...guestbookEntries]);
  };

  const toggleWindow = (windowId: string) => {
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
          setActiveWindow(openWindows.find((id) => id !== windowId) || "");
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
      setActiveWindow(openWindows.find((id) => id !== windowId) || "");
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
      setActiveWindow(nextActive || "");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Modern Wallpaper Background */}
      <Background />

      {/* Desktop Icons */}
      <Desktop onToggleWindow={toggleWindow} />

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
          <GuestbookApp
            entries={guestbookEntries}
            onAddEntry={addGuestbookEntry}
          />
        </ModernWindow>
      )}

      {/* Modern Dock/Taskbar */}
      <Taskbar
        openWindows={openWindows}
        activeWindow={activeWindow}
        windowStates={windowStates}
        onToggleWindow={toggleWindow}
      />
    </div>
  );
}
