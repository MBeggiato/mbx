# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- ✨ **changelog**: Added automatic changelog system
- ✨ update changelog for version 0.2.0 and enhance release management documentation
- ✨ **settings**: Added functional settings
- ✨ **ui**: implement comprehensive dark mode support
### Changed

- 📦 **settings**: Added settings app
- 🔧 **scripts**: enhance commit helper with CLI support
- 🧪 add simple test file
- 🔧 **Settings**: Reworked settings
- 📚 **docs**: add dark mode testing guide
- 🔧 **debug**: add theme debugging components and console logging
- 🔧 **cleanup**: remove debug components and finalize dark mode implementation
- 🔧 **debug**: add comprehensive theme debugging and auto-save
### Fixed

- 🐛 **css**: fix dark mode CSS specificity with html.dark selector
- 🐛 **hydration**: fix SSR hydration mismatch for theme system

## [0.2.0] - 2025-08-07

### Feature Enhancement

This minor release includes 11 changes with 5 new features, 2 bug fixes, 4 improvements. Enjoy the new features and enhanced functionality!

### Added

- Changelog app to view project updates
- Multiple file tabs support in Markdown Editor
- File tree sidebar with search functionality
- Context menu functionality in File Browser
- ✨ implement automated changelog system
### Changed

- Enhanced Markdown Editor with better multi-file management
- Improved file navigation and organization
- 📚 add test file for automation demo
- 🔧 remove test file
### Fixed

- Context menu appearing and functioning correctly
- File opening from File Browser to Markdown Editor

## [1.2.0] - 2025-08-06

### Added

- **Multi-tab Markdown Editor**: Open and edit multiple files simultaneously
- **File Tree Sidebar**: Navigate files with collapsible tree view and search
- **Enhanced File Browser**: Improved context menus and file operations
- **Auto-save functionality**: Automatic saving for open files
- **Responsive design**: Better mobile and desktop experience

### Changed

- Rebranded from Vista OS to Mbx OS throughout the application
- Improved file management with better state handling
- Enhanced UI/UX with modern components and interactions

### Fixed

- File browser context menu now appears and functions correctly
- Inter-component communication for file opening
- Memory management for multiple open files

## [1.1.0] - 2025-07-20

### Added

- **Modern Window System**: Resizable and draggable windows
- **File Picker Dialog**: Enhanced file selection with filtering
- **Virtual File System**: Complete file management with import/export
- **Markdown Editor**: Live preview with split view support

### Changed

- Migrated from fixed dialogs to resizable windows
- Improved file system with better error handling
- Enhanced markdown editing experience

### Fixed

- Window positioning and resizing issues
- File save/load functionality
- Cross-component event handling

## [1.0.0] - 2025-07-01

### Added

- **Initial Release**: Basic Mbx OS desktop environment
- **Window Management**: Multiple app windows support
- **File Browser**: Grid and list view for files
- **Basic Apps**: Calculator, text editor, and file management
- **Theme Support**: Light and dark theme switching

### Infrastructure

- Next.js 15.2.4 framework
- Tailwind CSS for styling
- Radix UI components
- TypeScript support
- Virtual file system implementation

---

## Release Notes

### Version 1.2.0 - "Multi-File Mastery"

This release focuses on productivity improvements with multi-file editing capabilities and enhanced navigation. The Markdown Editor now supports tabs for multiple files, making it easier to work on multiple documents simultaneously.

### Version 1.1.0 - "Modern Interface"

Introduced the modern window system that allows users to resize and move windows freely. The file management system was completely overhauled with a new virtual file system.

### Version 1.0.0 - "Foundation"

The initial release establishing the core desktop environment with basic functionality for file management, text editing, and window management.

## Contributing

When contributing to this project, please:

1. Add new features under the `[Unreleased]` section
2. Follow the changelog format with proper categorization
3. Include relevant details about breaking changes
4. Update version numbers according to semantic versioning

## Categories

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes
