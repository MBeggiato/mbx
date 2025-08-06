"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Calendar,
  Tag,
  GitBranch,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Download,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Zap,
  Shield,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define types for changelog data
interface ChangelogEntry {
  version: string;
  date: string;
  isUnreleased: boolean;
  added: string[];
  changed: string[];
  deprecated: string[];
  removed: string[];
  fixed: string[];
  security: string[];
}

interface ReleaseNote {
  version: string;
  title: string;
  description: string;
}

// Icons for different change types
const CHANGE_TYPE_ICONS = {
  added: { icon: Plus, color: "text-green-600", bg: "bg-green-100" },
  changed: { icon: Zap, color: "text-blue-600", bg: "bg-blue-100" },
  deprecated: {
    icon: AlertCircle,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
  },
  removed: { icon: Minus, color: "text-red-600", bg: "bg-red-100" },
  fixed: { icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-100" },
  security: { icon: Shield, color: "text-orange-600", bg: "bg-orange-100" },
};

export default function ChangelogApp() {
  const [changelogData, setChangelogData] = useState<ChangelogEntry[]>([]);
  const [releaseNotes, setReleaseNotes] = useState<ReleaseNote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(
    new Set(["unreleased"])
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load and parse changelog
  useEffect(() => {
    const loadChangelog = async () => {
      try {
        setLoading(true);

        // In a real app, you would fetch this from the file system or API
        // For now, we'll use the changelog content directly
        const response = await fetch("/CHANGELOG.md");
        if (!response.ok) {
          throw new Error("Failed to load changelog");
        }

        const markdownContent = await response.text();
        const parsed = parseChangelog(markdownContent);

        setChangelogData(parsed.entries);
        setReleaseNotes(parsed.releaseNotes);
        setError(null);
      } catch (err) {
        console.error("Error loading changelog:", err);
        setError("Failed to load changelog. Using fallback data.");

        // Fallback data
        setChangelogData([
          {
            version: "Unreleased",
            date: "",
            isUnreleased: true,
            added: [
              "Changelog app to view project updates",
              "Multiple file tabs support in Markdown Editor",
              "File tree sidebar with search functionality",
              "Context menu functionality in File Browser",
            ],
            changed: [
              "Enhanced Markdown Editor with better multi-file management",
              "Improved file navigation and organization",
            ],
            deprecated: [],
            removed: [],
            fixed: [
              "Context menu appearing and functioning correctly",
              "File opening from File Browser to Markdown Editor",
            ],
            security: [],
          },
          {
            version: "1.2.0",
            date: "2025-08-06",
            isUnreleased: false,
            added: [
              "Multi-tab Markdown Editor: Open and edit multiple files simultaneously",
              "File Tree Sidebar: Navigate files with collapsible tree view and search",
              "Enhanced File Browser: Improved context menus and file operations",
              "Auto-save functionality: Automatic saving for open files",
              "Responsive design: Better mobile and desktop experience",
            ],
            changed: [
              "Rebranded from Vista OS to Mbx OS throughout the application",
              "Improved file management with better state handling",
              "Enhanced UI/UX with modern components and interactions",
            ],
            deprecated: [],
            removed: [],
            fixed: [
              "File browser context menu now appears and functions correctly",
              "Inter-component communication for file opening",
              "Memory management for multiple open files",
            ],
            security: [],
          },
          {
            version: "1.1.0",
            date: "2025-07-20",
            isUnreleased: false,
            added: [
              "Modern Window System: Resizable and draggable windows",
              "File Picker Dialog: Enhanced file selection with filtering",
              "Virtual File System: Complete file management with import/export",
              "Markdown Editor: Live preview with split view support",
            ],
            changed: [
              "Migrated from fixed dialogs to resizable windows",
              "Improved file system with better error handling",
              "Enhanced markdown editing experience",
            ],
            deprecated: [],
            removed: [],
            fixed: [
              "Window positioning and resizing issues",
              "File save/load functionality",
              "Cross-component event handling",
            ],
            security: [],
          },
        ]);

        setReleaseNotes([
          {
            version: "1.2.0",
            title: "Multi-File Mastery",
            description:
              "This release focuses on productivity improvements with multi-file editing capabilities and enhanced navigation.",
          },
          {
            version: "1.1.0",
            title: "Modern Interface",
            description:
              "Introduced the modern window system that allows users to resize and move windows freely.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadChangelog();
  }, []);

  // Parse markdown changelog (simplified parser)
  const parseChangelog = (markdown: string) => {
    const entries: ChangelogEntry[] = [];
    const releaseNotes: ReleaseNote[] = [];

    // This is a simplified parser - in a real app you might want to use a proper markdown parser
    const lines = markdown.split("\n");
    let currentEntry: Partial<ChangelogEntry> | null = null;
    let currentSection = "";

    for (const line of lines) {
      // Version headers
      if (line.startsWith("## [")) {
        if (currentEntry) {
          entries.push(currentEntry as ChangelogEntry);
        }

        const versionMatch = line.match(/## \[(.*?)\](?:\s*-\s*(.*))?/);
        if (versionMatch) {
          currentEntry = {
            version: versionMatch[1],
            date: versionMatch[2] || "",
            isUnreleased: versionMatch[1].toLowerCase() === "unreleased",
            added: [],
            changed: [],
            deprecated: [],
            removed: [],
            fixed: [],
            security: [],
          };
        }
      }

      // Section headers
      else if (line.startsWith("### ")) {
        currentSection = line.replace("### ", "").toLowerCase();
      }

      // List items
      else if (line.startsWith("- ") && currentEntry && currentSection) {
        const item = line.replace("- ", "").replace(/^\*\*.*?\*\*:\s*/, "");

        switch (currentSection) {
          case "added":
            currentEntry.added!.push(item);
            break;
          case "changed":
            currentEntry.changed!.push(item);
            break;
          case "deprecated":
            currentEntry.deprecated!.push(item);
            break;
          case "removed":
            currentEntry.removed!.push(item);
            break;
          case "fixed":
            currentEntry.fixed!.push(item);
            break;
          case "security":
            currentEntry.security!.push(item);
            break;
        }
      }
    }

    if (currentEntry) {
      entries.push(currentEntry as ChangelogEntry);
    }

    return { entries, releaseNotes };
  };

  // Filter entries based on search and filter
  const filteredEntries = changelogData.filter((entry) => {
    const searchMatch =
      !searchTerm ||
      entry.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
      [
        ...entry.added,
        ...entry.changed,
        ...entry.fixed,
        ...entry.deprecated,
        ...entry.removed,
        ...entry.security,
      ].some((item) => item.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterType === "all") return searchMatch;
    if (filterType === "unreleased") return searchMatch && entry.isUnreleased;
    if (filterType === "released") return searchMatch && !entry.isUnreleased;

    return searchMatch;
  });

  const toggleVersion = (version: string) => {
    setExpandedVersions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(version)) {
        newSet.delete(version);
      } else {
        newSet.add(version);
      }
      return newSet;
    });
  };

  const renderChangeSection = (
    title: string,
    items: string[],
    type: keyof typeof CHANGE_TYPE_ICONS
  ) => {
    if (items.length === 0) return null;

    const { icon: Icon, color, bg } = CHANGE_TYPE_ICONS[type];

    return (
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className={`p-1 rounded ${bg}`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <h4 className="font-medium text-sm uppercase tracking-wide">
            {title}
          </h4>
        </div>
        <ul className="space-y-1 ml-6">
          {items.map((item, index) => (
            <li
              key={index}
              className="text-sm text-muted-foreground flex items-start"
            >
              <span className="mr-2 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const downloadChangelog = () => {
    const changelogText = changelogData
      .map((entry) => {
        let text = `## [${entry.version}]${
          entry.date ? ` - ${entry.date}` : ""
        }\n\n`;

        if (entry.added.length > 0) {
          text += `### Added\n${entry.added
            .map((item) => `- ${item}`)
            .join("\n")}\n\n`;
        }
        if (entry.changed.length > 0) {
          text += `### Changed\n${entry.changed
            .map((item) => `- ${item}`)
            .join("\n")}\n\n`;
        }
        if (entry.fixed.length > 0) {
          text += `### Fixed\n${entry.fixed
            .map((item) => `- ${item}`)
            .join("\n")}\n\n`;
        }
        if (entry.deprecated.length > 0) {
          text += `### Deprecated\n${entry.deprecated
            .map((item) => `- ${item}`)
            .join("\n")}\n\n`;
        }
        if (entry.removed.length > 0) {
          text += `### Removed\n${entry.removed
            .map((item) => `- ${item}`)
            .join("\n")}\n\n`;
        }
        if (entry.security.length > 0) {
          text += `### Security\n${entry.security
            .map((item) => `- ${item}`)
            .join("\n")}\n\n`;
        }

        return text;
      })
      .join("\n");

    const blob = new Blob([`# Changelog\n\n${changelogText}`], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CHANGELOG.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Loading changelog...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center space-x-2">
          <GitBranch className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">Changelog</span>
          <Badge variant="secondary">{changelogData.length} versions</Badge>
        </div>
        <div className="flex items-center space-x-2">
          {error && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              Fallback Data
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={downloadChangelog}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search changes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unreleased">Unreleased</SelectItem>
              <SelectItem value="released">Released</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setExpandedVersions(new Set(changelogData.map((e) => e.version)))
            }
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedVersions(new Set())}
          >
            Collapse All
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No changelog entries found</p>
              <p className="text-sm mt-1">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const isExpanded = expandedVersions.has(entry.version);
              const totalChanges =
                entry.added.length +
                entry.changed.length +
                entry.fixed.length +
                entry.deprecated.length +
                entry.removed.length +
                entry.security.length;

              return (
                <Card key={entry.version} className="overflow-hidden">
                  <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleVersion(entry.version)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <span>{entry.version}</span>
                            {entry.isUnreleased && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                Unreleased
                              </Badge>
                            )}
                          </CardTitle>
                          {entry.date && (
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" />
                              <span>{entry.date}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {totalChanges} changes
                        </Badge>
                        {entry.isUnreleased && (
                          <Tag className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="pt-0">
                      <Separator className="mb-4" />

                      {/* Release Notes */}
                      {releaseNotes.find(
                        (note) => note.version === entry.version
                      ) && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-900">
                              {
                                releaseNotes.find(
                                  (note) => note.version === entry.version
                                )?.title
                              }
                            </span>
                          </div>
                          <p className="text-sm text-blue-700">
                            {
                              releaseNotes.find(
                                (note) => note.version === entry.version
                              )?.description
                            }
                          </p>
                        </div>
                      )}

                      {/* Change Sections */}
                      <div className="space-y-4">
                        {renderChangeSection("Added", entry.added, "added")}
                        {renderChangeSection(
                          "Changed",
                          entry.changed,
                          "changed"
                        )}
                        {renderChangeSection("Fixed", entry.fixed, "fixed")}
                        {renderChangeSection(
                          "Deprecated",
                          entry.deprecated,
                          "deprecated"
                        )}
                        {renderChangeSection(
                          "Removed",
                          entry.removed,
                          "removed"
                        )}
                        {renderChangeSection(
                          "Security",
                          entry.security,
                          "security"
                        )}
                      </div>

                      {totalChanges === 0 && (
                        <p className="text-sm text-muted-foreground italic">
                          No changes recorded for this version.
                        </p>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground border-t bg-muted/30">
        <div className="flex items-center space-x-4">
          <span>{filteredEntries.length} versions shown</span>
          <span>
            {filteredEntries.filter((e) => e.isUnreleased).length} unreleased
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Mbx OS Changelog</span>
        </div>
      </div>
    </div>
  );
}
