"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface AppSettings {
  // Appearance
  theme: "light" | "dark" | "system";
  accentColor: string;
  fontSize: number;
  windowTransparency: number;
  animationsEnabled: boolean;

  // Audio
  masterVolume: number;
  notificationSounds: boolean;
  systemSounds: boolean;

  // Notifications
  showNotifications: boolean;
  notificationPosition:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left";
  autoHideNotifications: boolean;
  notificationDuration: number;

  // Privacy & Security
  autoSave: boolean;
  dataCollection: boolean;
  errorReporting: boolean;

  // System
  startupApps: string[];
  autoUpdate: boolean;
  language: string;
  timezone: string;

  // User Profile
  username: string;
  email: string;
  avatar: string;
}

const defaultSettings: AppSettings = {
  theme: "system",
  accentColor: "#3b82f6",
  fontSize: 14,
  windowTransparency: 95,
  animationsEnabled: true,
  masterVolume: 75,
  notificationSounds: true,
  systemSounds: true,
  showNotifications: true,
  notificationPosition: "top-right",
  autoHideNotifications: true,
  notificationDuration: 5,
  autoSave: true,
  dataCollection: false,
  errorReporting: true,
  startupApps: [],
  autoUpdate: true,
  language: "en",
  timezone: "UTC",
  username: "User",
  email: "",
  avatar: "",
};

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => void;
  saveSettings: () => Promise<void>;
  resetSettings: () => void;
  exportSettings: () => void;
  importSettings: (file: File) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

interface SettingsProviderProps {
  children: ReactNode;
  onStartupAppsChange?: (apps: string[]) => void;
  onAnimationsChange?: (enabled: boolean) => void;
  onVolumeChange?: (volume: number) => void;
  onNotificationSettingsChange?: (settings: any) => void;
  onThemeChange?: (theme: "light" | "dark" | "system") => void;
}

export function SettingsProvider({
  children,
  onStartupAppsChange,
  onAnimationsChange,
  onVolumeChange,
  onNotificationSettingsChange,
  onThemeChange,
}: SettingsProviderProps) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const savedSettings = localStorage.getItem("mbx-settings");
    console.log(
      "SettingsContext: Loading settings from localStorage:",
      savedSettings
    );
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        console.log("SettingsContext: Parsed settings:", parsed);
        const mergedSettings = { ...defaultSettings, ...parsed };
        console.log("SettingsContext: Merged settings:", mergedSettings);
        setSettings(mergedSettings);

        // Don't apply theme here - let next-themes handle its own persistence
        // The theme will be synced through the onThemeChange callback when next-themes initializes
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
      }
    } else {
      console.log("SettingsContext: No saved settings found, using defaults");
      // Don't apply default theme here - let next-themes handle its own initialization
    }
  }, []);

  // Apply CSS custom properties for dynamic styling
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--app-font-size", `${settings.fontSize}px`);
    root.style.setProperty(
      "--window-transparency",
      `${settings.windowTransparency}%`
    );
    root.style.setProperty("--accent-color", settings.accentColor);

    // Apply animations
    if (settings.animationsEnabled) {
      root.style.setProperty("--animation-duration", "0.2s");
      root.classList.remove("no-animations");
    } else {
      root.style.setProperty("--animation-duration", "0s");
      root.classList.add("no-animations");
    }
  }, [
    settings.fontSize,
    settings.windowTransparency,
    settings.accentColor,
    settings.animationsEnabled,
  ]);

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    console.log(`SettingsContext: Updating ${key} to:`, value);

    // Calculate the new settings object
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Apply changes immediately to the parent component
    switch (key) {
      case "theme":
        console.log("SettingsContext: Calling onThemeChange with:", value);
        onThemeChange?.(value as "light" | "dark" | "system");
        // Don't save theme to localStorage - next-themes handles that
        // Only save non-theme settings
        if (typeof window !== "undefined") {
          setTimeout(() => {
            const { theme, ...otherSettings } = newSettings;
            const settingsToSave = { ...otherSettings, theme: value }; // Include theme for UI state
            localStorage.setItem(
              "mbx-settings",
              JSON.stringify(settingsToSave)
            );
            console.log(
              "SettingsContext: Saved non-theme settings (theme delegated to next-themes)"
            );
          }, 0);
        }
        break;
      case "startupApps":
        onStartupAppsChange?.(value as string[]);
        break;
      case "animationsEnabled":
        onAnimationsChange?.(value as boolean);
        break;
      case "masterVolume":
        onVolumeChange?.(value as number);
        break;
      case "showNotifications":
      case "notificationPosition":
      case "autoHideNotifications":
      case "notificationDuration":
        onNotificationSettingsChange?.({
          showNotifications:
            key === "showNotifications" ? value : settings.showNotifications,
          notificationPosition:
            key === "notificationPosition"
              ? value
              : settings.notificationPosition,
          autoHideNotifications:
            key === "autoHideNotifications"
              ? value
              : settings.autoHideNotifications,
          notificationDuration:
            key === "notificationDuration"
              ? value
              : settings.notificationDuration,
        });
        break;
    }
  };

  const saveSettings = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("mbx-settings", JSON.stringify(settings));
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      throw error;
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    if (typeof window !== "undefined") {
      localStorage.removeItem("mbx-settings");
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `mbx-settings-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importSettings = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setSettings({ ...defaultSettings, ...imported });
      } catch (error) {
        console.error("Failed to import settings:", error);
        throw error;
      }
    };
    reader.readAsText(file);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        saveSettings,
        resetSettings,
        exportSettings,
        importSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
