# Tech Stack Guide

Comprehensive overview of the technology stack used in this Mbx OS project.

## 🏗️ Core Framework & Runtime

- **Next.js 15.2.4** - React-based web framework with App Router
- **React 19** - UI library for component-based development
- **TypeScript 5** - Type-safe JavaScript development
- **Node.js** - Runtime for build tools and automation scripts

## 🎨 Styling & UI Components

- **Tailwind CSS 4.1.9** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
  - Dialog, Dropdown, Navigation, Toast, Tabs, etc.
- **shadcn/ui** - Pre-built component library using Radix + Tailwind
- **Lucide React** - Icon library
- **Class Variance Authority (CVA)** - Component variant utilities

## 📱 Application Architecture

- **Desktop Simulation** - Browser-based OS interface
- **Window Management** - Draggable, resizable application windows
- **Start Menu System** - Application launcher and navigation
- **Component-based Apps** - Modular application architecture

## 🛠️ Development Tools

- **bun** - Fast, efficient package manager and runtime
- **PostCSS** - CSS preprocessing and optimization
- **ESLint** - Code linting and formatting
- **Autoprefixer** - CSS vendor prefix automation

## 📝 Content & Data

- **Markdown Processing** - `@uiw/react-md-editor` for editing
- **File Management** - Browser-based file system simulation
- **Audio Support** - `react-h5-audio-player` for media playback
- **Form Handling** - React Hook Form with Zod validation

## 🔄 Automation & DevOps

- **Git Hooks** - Automated changelog updates
- **Conventional Commits** - Standardized commit messages
- **Semantic Versioning** - Automated version management
- **Release Scripts** - Node.js-based release automation

## 📊 Data Visualization

- **Recharts** - Chart and graph components
- **Date-fns** - Date manipulation utilities
- **React Day Picker** - Calendar components

## 🎯 Key Libraries by Category

### UI/UX Enhancement

- `next-themes` - Dark/light mode theming
- `sonner` - Toast notifications
- `vaul` - Drawer components
- `embla-carousel-react` - Carousel functionality

### Development Utilities

- `clsx` & `tailwind-merge` - Conditional class handling
- `cmdk` - Command palette interface
- `input-otp` - OTP input components
- `react-resizable-panels` - Resizable layouts

### Data & Validation

- `zod` - Schema validation
- `@hookform/resolvers` - Form validation integration
- `bad-words` - Content filtering

## 🏃‍♂️ Getting Started Commands

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Start production server
bun start

# Run linting
bun run lint

# Create release
bun run release:minor
```

## 🔧 Configuration Files

- `next.config.mjs` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS setup
- `tsconfig.json` - TypeScript configuration
- `postcss.config.mjs` - PostCSS processing
- `components.json` - shadcn/ui configuration

## 📁 Project Structure

```
app/                 # Next.js App Router pages
components/          # Reusable React components
  apps/             # Desktop application components
  ui/               # shadcn/ui component library
hooks/              # Custom React hooks
lib/                # Utility functions
public/             # Static assets
scripts/            # Automation and build scripts
guides/             # Documentation
.githooks/          # Git automation hooks
```

This stack provides a modern, type-safe development environment for building desktop-like web applications with automated tooling and comprehensive UI components.
