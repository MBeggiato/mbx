"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  FileText,
  Download,
  Upload,
  Eye,
  Edit3,
  Save,
  FileImage,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 bg-muted rounded-md">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading editor...</span>
        </div>
      </div>
    ),
  }
);

const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 bg-muted rounded-md">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading preview...</span>
        </div>
      </div>
    ),
  }
);

const defaultMarkdown = `# Welcome to Markdown Editor

This is a **bold** text and this is *italic* text.

## Features

- ✅ Live preview
- ✅ Syntax highlighting
- ✅ File operations
- ✅ Export functionality
- ✅ Dark/Light theme support

### Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\`

### Table Example

| Feature | Status |
|---------|--------|
| Editor | ✅ |
| Preview | ✅ |
| Export | ✅ |

> This is a blockquote. You can use it to highlight important information.

[Visit my website](https://marcel-mbx.dev)
`;

export default function MarkdownEditorApp() {
  const [markdown, setMarkdown] = useState<string>(defaultMarkdown);
  const [fileName, setFileName] = useState<string>("untitled.md");
  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "split">(
    "editor"
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleMarkdownChange = useCallback((value?: string) => {
    setMarkdown(value || "");
  }, []);

  const handleSaveFile = useCallback(() => {
    setIsSaving(true);
    try {
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName.endsWith(".md") ? fileName : `${fileName}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error saving file:", error);
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  }, [markdown, fileName]);

  const handleLoadFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setMarkdown(content);
          setFileName(file.name);
        };
        reader.readAsText(file);
      }
    },
    []
  );

  const handleExportHtml = useCallback(() => {
    // This would require a markdown-to-html converter
    // For now, we'll just export the markdown
    const blob = new Blob([markdown], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.replace(/\.md$/, ".html");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [markdown, fileName]);

  const handleNewFile = useCallback(() => {
    setMarkdown("");
    setFileName("untitled.md");
  }, []);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">Markdown Editor</span>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-48 h-8"
            placeholder="filename.md"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewFile}
            className="h-8"
          >
            <FileText className="h-4 w-4 mr-1" />
            New
          </Button>

          <label htmlFor="file-upload">
            <Button variant="outline" size="sm" className="h-8" asChild>
              <span>
                <Upload className="h-4 w-4 mr-1" />
                Open
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".md,.markdown,.txt"
            onChange={handleLoadFile}
            className="hidden"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveFile}
            disabled={isSaving}
            className="h-8"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            Save
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportHtml}
            className="h-8"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
        >
          <TabsList className="h-8">
            <TabsTrigger value="editor" className="text-xs">
              <Edit3 className="h-3 w-3 mr-1" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="split" className="text-xs">
              <FileImage className="h-3 w-3 mr-1" />
              Split
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "editor" && (
          <div className="h-full">
            <MDEditor
              value={markdown}
              onChange={handleMarkdownChange}
              preview="edit"
              hideToolbar
              data-color-mode="light"
              height="100%"
            />
          </div>
        )}

        {activeTab === "preview" && (
          <div className="h-full overflow-auto p-4">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-6">
                <MarkdownPreview
                  source={markdown}
                  style={{ backgroundColor: "transparent" }}
                  data-color-mode="light"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "split" && (
          <div className="h-full flex">
            <div className="flex-1 border-r">
              <MDEditor
                value={markdown}
                onChange={handleMarkdownChange}
                preview="edit"
                hideToolbar
                data-color-mode="light"
                height="100%"
              />
            </div>
            <div className="flex-1 overflow-auto p-4">
              <MarkdownPreview
                source={markdown}
                style={{ backgroundColor: "transparent" }}
                data-color-mode="light"
              />
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground border-t bg-muted/30">
        <div className="flex items-center space-x-4">
          <span>Characters: {markdown.length}</span>
          <span>
            Words:{" "}
            {markdown.split(/\s+/).filter((word) => word.length > 0).length}
          </span>
          <span>Lines: {markdown.split("\n").length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Markdown</span>
          <span>•</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}
