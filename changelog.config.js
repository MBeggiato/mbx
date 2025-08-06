/**
 * Changelog Configuration for Mbx OS
 * Defines how commit types map to changelog sections
 */

module.exports = {
  // Automatic version release
  autoRelease: false, // Set to true to auto-release versions on feat/fix commits
  
  // Commit type mappings
  types: {
    feat: {
      section: 'Added',
      icon: '✨ ',
      description: 'New features'
    },
    fix: {
      section: 'Fixed', 
      icon: '🐛 ',
      description: 'Bug fixes'
    },
    docs: {
      section: 'Changed',
      icon: '📚 ',
      description: 'Documentation updates'
    },
    style: {
      section: 'Changed',
      icon: '💄 ',
      description: 'Code style changes'
    },
    refactor: {
      section: 'Changed',
      icon: '♻️ ',
      description: 'Code refactoring'
    },
    perf: {
      section: 'Changed',
      icon: '⚡ ',
      description: 'Performance improvements'
    },
    test: {
      section: 'Changed',
      icon: '🧪 ',
      description: 'Test updates'
    },
    chore: {
      section: 'Changed',
      icon: '🔧 ',
      description: 'Maintenance tasks'
    },
    ci: {
      section: 'Changed',
      icon: '👷 ',
      description: 'CI/CD changes'
    },
    build: {
      section: 'Changed',
      icon: '📦 ',
      description: 'Build system changes'
    }
  },
  
  // Version bump rules
  versionRules: {
    major: ['feat'], // Features that justify major version bump
    minor: ['feat'], // Features that justify minor version bump  
    patch: ['fix', 'perf'], // Changes that justify patch version bump
    none: ['docs', 'style', 'refactor', 'test', 'chore', 'ci', 'build'] // No version bump
  },
  
  // Breaking change detection
  breakingChangePatterns: [
    'BREAKING CHANGE:',
    'BREAKING-CHANGE:',
    '!:'
  ],
  
  // Changelog sections order
  sectionOrder: [
    'Added',
    'Changed', 
    'Deprecated',
    'Removed',
    'Fixed',
    'Security'
  ],
  
  // Release notes templates
  releaseNotes: {
    major: {
      template: 'This major release includes breaking changes and significant new features.',
      examples: [
        '## Breaking Changes\n\nPlease review the following breaking changes before upgrading:',
        '## Migration Guide\n\nTo migrate from the previous version:'
      ]
    },
    minor: {
      template: 'This release includes new features and improvements.',
      examples: [
        '## New Features\n\nThis release introduces:',
        '## Improvements\n\nWe have enhanced:'
      ]
    },
    patch: {
      template: 'This release includes bug fixes and minor improvements.',
      examples: [
        '## Bug Fixes\n\nThis release fixes:',
        '## Stability\n\nWe have improved:'
      ]
    }
  }
};
