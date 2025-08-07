# Mbx OS App Development Guide

A comprehensive guide for creating new applications in the Mbx OS desktop environment.

## Table of Contents

1. [Overview](#overview)
2. [App Architecture](#app-architecture)
3. [Step-by-Step App Creation](#step-by-step-app-creation)
4. [Window System Integration](#window-system-integration)
5. [File System Integration](#file-system-integration)
6. [Styling Guidelines](#styling-guidelines)
7. [Best Practices](#best-practices)
8. [Examples](#examples)
9. [Troubleshooting](#troubleshooting)

## Overview

Mbx OS is a modern desktop operating system simulation built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. The system features:

- **Modern Window System**: Resizable, draggable windows with minimize/maximize functionality
- **Virtual File System**: Shared localStorage-based file system across apps
- **Component-Based Architecture**: Each app is a React component
- **Integrated Start Menu**: Automatic app registration and discovery
- **State Management**: URL-based state persistence and window management

## App Architecture

### Core Components

```
Mbx OS Structure:
├── app/page.tsx                 # Main desktop system
├── components/
│   ├── ModernWindow.tsx         # Window wrapper component
│   ├── StartMenu.tsx           # App launcher and registration
│   ├── Desktop.tsx             # Desktop icons
│   ├── Taskbar.tsx             # Bottom taskbar
│   └── apps/                   # Application components
│       ├── YourApp.tsx         # Your new app component
│       ├── CalculatorApp.tsx   # Example app
│       └── ...
└── lib/
    └── virtualFileSystem.ts    # Shared file system utilities
```

### App Component Structure

Each app follows this basic structure:

```tsx
// components/apps/YourApp.tsx
"use client";

import { useState, useEffect } from "react";
import { Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
// ... other UI imports

export default function YourApp() {
  // State management
  const [state, setState] = useState();

  // Effects and lifecycle
  useEffect(() => {
    // Initialization logic
  }, []);

  // Event handlers
  const handleAction = () => {
    // Action logic
  };

  // Render
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="font-semibold">Your App</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">{/* Your app content */}</div>

      {/* Footer/Status Bar (optional) */}
      <div className="px-4 py-2 border-t text-xs text-muted-foreground">
        Status information
      </div>
    </div>
  );
}
```

## Step-by-Step App Creation

### Step 1: Create the App Component

Create a new file in `components/apps/` directory:

```bash
touch components/apps/MyNewApp.tsx
```

### Step 2: Basic App Template

```tsx
// components/apps/MyNewApp.tsx
"use client";

import { useState } from "react";
import { AppWindow } from "lucide-react"; // Choose an appropriate icon
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyNewApp() {
  const [counter, setCounter] = useState(0);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center space-x-2">
          <AppWindow className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">My New App</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to My New App</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Counter: {counter}</p>
            <Button onClick={() => setCounter((c) => c + 1)}>Increment</Button>
          </CardContent>
        </Card>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground border-t bg-muted/30">
        <span>Ready</span>
        <span>Mbx OS</span>
      </div>
    </div>
  );
}
```

### Step 3: Register in Start Menu

Edit `components/StartMenu.tsx`:

1. **Add Icon Import**:

```tsx
import {
  // ... existing imports
  AppWindow, // Your app icon
} from "lucide-react";
```

2. **Add to systemApps Array**:

```tsx
const systemApps = [
  // ... existing apps
  {
    id: "mynewapp",
    name: "My New App",
    icon: AppWindow,
    category: "Tools", // Choose: Tools, Media, Files, Entertainment, Internet, System
  },
];
```

### Step 4: Add to Main Window System

Edit `app/page.tsx`:

1. **Add Import**:

```tsx
import MyNewApp from "@/components/apps/MyNewApp";
```

2. **Add Window State**:

```tsx
const [windowStates, setWindowStates] = useState<Record<string, WindowState>>({
  // ... existing window states
  mynewapp: {
    position: { x: 200, y: 150 },
    size: { width: 600, height: 500 },
    isMinimized: false,
    isMaximized: false,
    zIndex: 15,
  },
});
```

3. **Add Window Rendering**:

```tsx
{
  openWindows.includes("mynewapp") && (
    <ModernWindow
      windowId="mynewapp"
      title="My New App"
      isActive={activeWindow === "mynewapp"}
      windowState={windowStates.mynewapp}
      onClose={() => closeWindow("mynewapp")}
      onMinimize={() => minimizeWindow("mynewapp")}
      onMaximize={() => maximizeWindow("mynewapp")}
      onFocus={() => bringToFront("mynewapp")}
      onUpdateState={(updates) => updateWindowState("mynewapp", updates)}
    >
      <MyNewApp />
    </ModernWindow>
  );
}
```

## Window System Integration

### Window Properties

Each window can be configured with:

```tsx
interface WindowState {
  position: { x: number; y: number }; // Initial position
  size: { width: number; height: number }; // Initial size
  isMinimized: boolean; // Minimized state
  isMaximized: boolean; // Maximized state
  zIndex: number; // Window layering
}
```

### Window Sizing Guidelines

- **Small Apps** (Calculator): 350×500px
- **Medium Apps** (Text Editor): 600×500px
- **Large Apps** (File Browser): 800×600px
- **Full Apps** (Code Editor): 950×700px

### Window Positioning

Position windows with offset to avoid overlap:

```tsx
position: { x: baseX + (appIndex * 50), y: baseY + (appIndex * 30) }
```

## File System Integration

### Using Virtual File System

```tsx
import {
  saveFile,
  loadFile,
  deleteFile,
  listFiles,
} from "@/lib/virtualFileSystem";

// In your app component
const handleSave = async () => {
  try {
    await saveFile("myapp/data.json", JSON.stringify(data));
    console.log("File saved successfully");
  } catch (error) {
    console.error("Save failed:", error);
  }
};

const handleLoad = async () => {
  try {
    const content = await loadFile("myapp/data.json");
    const data = JSON.parse(content);
    setData(data);
  } catch (error) {
    console.error("Load failed:", error);
  }
};
```

### File System Events

Listen for file system changes from other apps:

```tsx
useEffect(() => {
  const handleFileSystemChange = (event: CustomEvent) => {
    // Handle file system changes
    refreshFileList();
  };

  window.addEventListener("virtualFileSystemChange", handleFileSystemChange);

  return () => {
    window.removeEventListener(
      "virtualFileSystemChange",
      handleFileSystemChange
    );
  };
}, []);
```

## Styling Guidelines

### Color Scheme

Use the established color tokens:

```tsx
// Backgrounds
bg - background; // Main background
bg - card; // Card/panel background
bg - muted; // Subtle background
bg - accent; // Accent background

// Text
text - foreground; // Primary text
text - muted - foreground; // Secondary text

// Borders
border; // Standard borders
border - accent; // Accent borders
```

### Layout Pattern

Follow this consistent layout pattern:

```tsx
<div className="flex flex-col h-full bg-background">
  {/* Header - Fixed height */}
  <div className="flex items-center justify-between p-4 border-b bg-card">
    <div className="flex items-center space-x-2">
      <Icon className="h-5 w-5 text-blue-600" />
      <span className="font-semibold">App Name</span>
    </div>
    <div className="flex items-center space-x-2">{/* Header actions */}</div>
  </div>

  {/* Toolbar (optional) */}
  <div className="flex items-center p-2 border-b bg-muted/30">
    {/* Toolbar content */}
  </div>

  {/* Main Content - Flexible height */}
  <div className="flex-1 overflow-auto">{/* Scrollable content */}</div>

  {/* Status Bar (optional) - Fixed height */}
  <div className="px-4 py-2 border-t text-xs text-muted-foreground bg-muted/30">
    {/* Status information */}
  </div>
</div>
```

### Responsive Design

Make your app responsive:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid content */}
</div>

<div className="flex flex-col sm:flex-row gap-4">
  {/* Responsive flex content */}
</div>
```

## Best Practices

### 1. State Management

- Use `useState` for local component state
- Use `useEffect` for side effects and lifecycle management
- Consider `useCallback` and `useMemo` for performance optimization

### 2. Error Handling

Always implement error boundaries and try-catch blocks:

```tsx
const [error, setError] = useState<string | null>(null);

const handleAction = async () => {
  try {
    setError(null);
    // Your action logic
  } catch (err) {
    setError(err instanceof Error ? err.message : "An error occurred");
  }
};

// In render
{
  error && (
    <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
      Error: {error}
    </div>
  );
}
```

### 3. Loading States

Provide feedback during async operations:

```tsx
const [loading, setLoading] = useState(false);

const handleAsyncAction = async () => {
  setLoading(true);
  try {
    // Async operation
  } finally {
    setLoading(false);
  }
};

// In render
{loading ? (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
) : (
  // Normal content
)}
```

### 4. Keyboard Shortcuts

Implement common keyboard shortcuts:

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "s":
          e.preventDefault();
          handleSave();
          break;
        case "o":
          e.preventDefault();
          handleOpen();
          break;
      }
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);
```

### 5. Accessibility

Follow accessibility best practices:

```tsx
// Use semantic HTML
<button
  aria-label="Save file"
  disabled={loading}
  onClick={handleSave}
>
  <Save className="h-4 w-4" />
  {loading ? 'Saving...' : 'Save'}
</button>

// Provide focus indicators
<input
  className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
  placeholder="Enter text..."
/>
```

## Examples

### Example 1: Simple Note-Taking App

```tsx
// components/apps/NotesApp.tsx
"use client";

import { useState, useEffect } from "react";
import { FileText, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveFile, loadFile, listFiles } from "@/lib/virtualFileSystem";

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: string;
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const files = await listFiles("notes/");
      const notePromises = files
        .filter((f) => f.endsWith(".json"))
        .map(async (file) => {
          const content = await loadFile(file);
          return JSON.parse(content);
        });

      const loadedNotes = await Promise.all(notePromises);
      setNotes(
        loadedNotes.sort(
          (a, b) =>
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime()
        )
      );
    } catch (error) {
      console.error("Failed to load notes:", error);
    }
  };

  const saveNote = async () => {
    if (!title.trim()) return;

    const note: Note = {
      id: selectedNote?.id || Date.now().toString(),
      title: title.trim(),
      content: content,
      lastModified: new Date().toISOString(),
    };

    try {
      await saveFile(`notes/${note.id}.json`, JSON.stringify(note));

      setNotes((prev) => {
        const updated = prev.filter((n) => n.id !== note.id);
        return [note, ...updated];
      });

      setSelectedNote(note);
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const createNew = () => {
    setSelectedNote(null);
    setTitle("");
    setContent("");
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <Button onClick={createNew} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${
                selectedNote?.id === note.id ? "bg-muted" : ""
              }`}
              onClick={() => selectNote(note)}
            >
              <h3 className="font-medium truncate">{note.title}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {note.content || "No content"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(note.lastModified).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <Input
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 mr-4"
          />
          <Button onClick={saveNote} disabled={!title.trim()}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>

        <div className="flex-1 p-4">
          <Textarea
            placeholder="Start writing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full resize-none"
          />
        </div>
      </div>
    </div>
  );
}
```

### Example 2: Data Visualization App

```tsx
// components/apps/ChartApp.tsx
"use client";

import { useState } from "react";
import { BarChart3, PieChart, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChartApp() {
  const [chartType, setChartType] = useState("bar");
  const [data] = useState([
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 500 },
    { name: "Apr", value: 280 },
    { name: "May", value: 390 },
  ]);

  const renderChart = () => {
    // Simple text-based chart for demonstration
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center space-x-2">
            <span className="w-10 text-sm">{item.name}</span>
            <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="w-12 text-sm text-right">{item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">Chart Viewer</span>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {chartType === "bar" && <BarChart3 className="h-5 w-5" />}
              {chartType === "line" && <LineChart className="h-5 w-5" />}
              {chartType === "pie" && <PieChart className="h-5 w-5" />}
              <span>Sample Data Visualization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>{renderChart()}</CardContent>
        </Card>
      </div>

      <div className="px-4 py-2 border-t text-xs text-muted-foreground bg-muted/30">
        {data.length} data points • {chartType} chart
      </div>
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **App not appearing in Start Menu**

   - Check that the app is added to `systemApps` array in `StartMenu.tsx`
   - Verify the icon import is correct
   - Ensure the `id` matches between StartMenu and window registration

2. **Window not opening**

   - Verify the app is imported in `app/page.tsx`
   - Check that window state is defined with correct `id`
   - Ensure window rendering block is added

3. **Styling issues**

   - Use Tailwind classes consistently
   - Follow the layout pattern: header, main content, footer
   - Test responsive behavior on different screen sizes

4. **File system integration problems**
   - Import functions from `@/lib/virtualFileSystem`
   - Handle async operations with proper error catching
   - Use consistent file paths and naming

### Debugging Tips

1. **Use Console Logging**:

```tsx
console.log("App mounted");
console.log("State changed:", state);
```

2. **Check React DevTools**:

   - Install React Developer Tools browser extension
   - Inspect component state and props

3. **Network Tab**:

   - Check for failed resource loads
   - Verify API calls if your app makes external requests

4. **Build Errors**:

```bash
bun run build  # Check for TypeScript errors
bun run lint   # Check for linting issues
```

### Performance Optimization

1. **Memoization**:

```tsx
const expensiveComputation = useMemo(() => {
  return processLargeData(data);
}, [data]);

const handleCallback = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

2. **Lazy Loading**:

```tsx
const HeavyComponent = lazy(() => import("./HeavyComponent"));

// In render
<Suspense fallback={<div>Loading...</div>}>
  <HeavyComponent />
</Suspense>;
```

3. **Virtual Scrolling** for large lists:

```tsx
// Consider libraries like react-window for large datasets
```

---

## Conclusion

You now have everything needed to create sophisticated apps for the Mbx OS environment! Remember to:

- Follow the established patterns and conventions
- Test your app thoroughly across different screen sizes
- Implement proper error handling and loading states
- Use the virtual file system for data persistence
- Keep the user experience consistent with other system apps

Happy coding! 🚀

---

**Last Updated**: August 6, 2025  
**Version**: 1.0.0  
**Mbx OS Version**: 1.2.0
