import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeDebugger() {
  const { theme, setTheme, themes } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading theme...</div>;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-background border border-border text-foreground p-4 rounded-lg shadow-lg">
      <h3 className="font-bold mb-2">Theme Debugger</h3>
      <p>Current theme: {theme}</p>
      <p>Available themes: {themes?.join(", ")}</p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setTheme("light")}
          className="px-2 py-1 bg-primary text-primary-foreground rounded"
        >
          Light
        </button>
        <button
          onClick={() => setTheme("dark")}
          className="px-2 py-1 bg-primary text-primary-foreground rounded"
        >
          Dark
        </button>
        <button
          onClick={() => setTheme("system")}
          className="px-2 py-1 bg-primary text-primary-foreground rounded"
        >
          System
        </button>
      </div>
    </div>
  );
}
