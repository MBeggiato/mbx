"use client";

import { useState, useEffect } from "react";
import { Minus, Square, X } from "lucide-react";

interface WindowState {
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface ModernWindowProps {
  windowId: string;
  title: string;
  children: any;
  isActive: boolean;
  windowState: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onUpdateState: (updates: Partial<WindowState>) => void;
}

export default function ModernWindow({
  windowId,
  title,
  children,
  isActive,
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdateState,
}: ModernWindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const handleMouseDown = (e: any) => {
    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).closest(".window-title")
    ) {
      if (windowState.isMaximized) return;
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - windowState.position.x,
        y: e.clientY - windowState.position.y,
      });
      onFocus();
      e.preventDefault();
    }
  };

  const handleResizeStart = (e: any) => {
    if (windowState.isMaximized) return;
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: windowState.size.width,
      height: windowState.size.height,
    });
    onFocus();
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = (e: any) => {
    if (isDragging && !windowState.isMaximized) {
      const newX = Math.max(
        0,
        Math.min(
          window.innerWidth - windowState.size.width,
          e.clientX - dragOffset.x
        )
      );
      const newY = Math.max(
        0,
        Math.min(window.innerHeight - 100, e.clientY - dragOffset.y)
      );

      onUpdateState({ position: { x: newX, y: newY } });
    } else if (isResizing && !windowState.isMaximized) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const newWidth = Math.max(
        400,
        Math.min(
          window.innerWidth - windowState.position.x,
          resizeStart.width + deltaX
        )
      );
      const newHeight = Math.max(
        300,
        Math.min(
          window.innerHeight - windowState.position.y - 100,
          resizeStart.height + deltaY
        )
      );

      onUpdateState({ size: { width: newWidth, height: newHeight } });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleDoubleClick = () => {
    onMaximize();
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
      document.body.style.cursor = isDragging ? "move" : "nw-resize";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      };
    }
  }, [isDragging, isResizing, dragOffset, resizeStart]);

  if (windowState.isMinimized) {
    return null;
  }

  return (
    <div
      className={`window absolute bg-background rounded-2xl shadow-2xl border border-border transition-all duration-300 ease-out ${
        isDragging || isResizing ? "select-none" : ""
      } ${windowState.isMaximized ? "!rounded-none" : ""}`}
      style={{
        left: windowState.position.x,
        top: windowState.position.y,
        width: windowState.size.width,
        height: windowState.size.height,
        zIndex: windowState.zIndex,
        boxShadow: isActive
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)"
          : "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        transform: windowState.isMinimized
          ? "scale(0.8) translateY(100px)"
          : "scale(1) translateY(0)",
        opacity: windowState.isMinimized ? 0 : 1,
      }}
      onClick={onFocus}
    >
      {/* Window Title Bar */}
      <div
        className={`window-titlebar h-14 flex items-center justify-between px-6 cursor-move window-title bg-card border-b border-border ${
          windowState.isMaximized ? "!rounded-none" : "rounded-t-2xl"
        }`}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <span className="text-lg font-semibold text-card-foreground pointer-events-none">
          {title}
        </span>
        <div className="flex space-x-3">
          <button
            className="w-5 h-5 bg-yellow-400 hover:bg-yellow-500 rounded-full cursor-pointer transition-colors duration-150 shadow-sm flex items-center justify-center group"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
          >
            <Minus className="w-3 h-3 text-yellow-800 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            className="w-5 h-5 bg-green-400 hover:bg-green-500 rounded-full cursor-pointer transition-colors duration-150 shadow-sm flex items-center justify-center group"
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
          >
            <Square className="w-2.5 h-2.5 text-green-800 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            className="w-5 h-5 bg-red-400 hover:bg-red-500 rounded-full cursor-pointer transition-colors duration-150 shadow-sm flex items-center justify-center group"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="w-3 h-3 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div
        className={`bg-background overflow-hidden ${
          windowState.isMaximized ? "!rounded-none" : "rounded-b-2xl"
        }`}
        style={{ height: "calc(100% - 56px)" }}
      >
        {children}
      </div>

      {/* Resize Handle */}
      {!windowState.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize opacity-0 hover:opacity-100 transition-opacity"
          onMouseDown={handleResizeStart}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      )}
    </div>
  );
}

export type { WindowState };
