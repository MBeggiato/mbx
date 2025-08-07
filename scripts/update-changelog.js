#!/usr/bin/env node

/**
 * Automatic Changelog Generator for Mbx OS
 * Updates CHANGELOG.md based on conventional commit messages
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Load configuration
const config = require("../changelog.config.js");

class ChangelogGenerator {
  constructor() {
    this.changelogPath = path.join(process.cwd(), "CHANGELOG.md");
    this.packagePath = path.join(process.cwd(), "package.json");
  }

  /**
   * Get the latest commit message
   */
  getLatestCommit() {
    try {
      const commitMessage = execSync("git log -1 --pretty=%B", {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
      }).trim();
      return commitMessage;
    } catch (error) {
      console.log("No git repository found or no commits yet.");
      return null;
    }
  }

  /**
   * Parse conventional commit message
   */
  parseCommit(message) {
    const conventionalPattern =
      /^(feat|fix|docs|style|refactor|perf|test|chore|ci|build)(\(.+\))?: (.+)$/;
    const match = message.match(conventionalPattern);

    if (!match) {
      return null;
    }

    const [, type, scope, description] = match;

    // Check for breaking changes
    const isBreaking =
      message.includes("BREAKING CHANGE:") ||
      message.includes("!:") ||
      description.includes("!");

    return {
      type,
      scope: scope ? scope.slice(1, -1) : null, // Remove parentheses
      description,
      isBreaking,
      raw: message,
    };
  }

  /**
   * Get current version from package.json
   */
  getCurrentVersion() {
    try {
      const packageJson = JSON.parse(fs.readFileSync(this.packagePath, "utf8"));
      return packageJson.version || "1.0.0";
    } catch (error) {
      return "1.0.0";
    }
  }

  /**
   * Increment version based on commit type
   */
  incrementVersion(currentVersion, commitType, isBreaking) {
    const [major, minor, patch] = currentVersion.split(".").map(Number);

    if (isBreaking) {
      return `${major + 1}.0.0`;
    }

    switch (commitType) {
      case "feat":
        return `${major}.${minor + 1}.0`;
      case "fix":
      case "perf":
        return `${major}.${minor}.${patch + 1}`;
      default:
        return currentVersion; // No version bump for other types
    }
  }

  /**
   * Read current changelog
   */
  readChangelog() {
    try {
      return fs.readFileSync(this.changelogPath, "utf8");
    } catch (error) {
      // Create basic changelog if it doesn't exist
      return `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

`;
    }
  }

  /**
   * Format commit entry based on type
   */
  formatCommitEntry(commit) {
    const typeConfig = config.types[commit.type];
    if (!typeConfig) return null;

    const icon = typeConfig.icon || "";
    const scope = commit.scope ? `**${commit.scope}**: ` : "";

    return `- ${icon}${scope}${commit.description}`;
  }

  /**
   * Add entry to unreleased section
   */
  addToUnreleased(changelog, entry, section) {
    const unreleasedPattern =
      /## \[Unreleased\]([\s\S]*?)(?=## \[|\n---|\n## |$)/;
    const match = changelog.match(unreleasedPattern);

    if (!match) {
      console.log("Could not find Unreleased section");
      return changelog;
    }

    const unreleasedContent = match[1];
    const sectionPattern = new RegExp(
      `### ${section}([\\s\\S]*?)(?=### |\\n## |$)`
    );
    const sectionMatch = unreleasedContent.match(sectionPattern);

    let newUnreleasedContent;

    if (sectionMatch) {
      // Section exists, add to it
      const existingEntries = sectionMatch[1].trim();
      const newSection = existingEntries
        ? `### ${section}\n\n${existingEntries}\n${entry}\n`
        : `### ${section}\n\n${entry}\n`;

      newUnreleasedContent = unreleasedContent.replace(
        sectionPattern,
        newSection
      );
    } else {
      // Section doesn't exist, create it
      const sections = [
        "Added",
        "Changed",
        "Deprecated",
        "Removed",
        "Fixed",
        "Security",
      ];
      const sectionIndex = sections.indexOf(section);

      if (sectionIndex === -1) return changelog;

      // Find the right place to insert the new section
      let insertAfter = "";
      for (let i = sectionIndex - 1; i >= 0; i--) {
        const prevSectionPattern = new RegExp(`### ${sections[i]}`);
        if (unreleasedContent.match(prevSectionPattern)) {
          insertAfter = sections[i];
          break;
        }
      }

      const newSection = `\n### ${section}\n\n${entry}\n`;

      if (insertAfter) {
        const insertPattern = new RegExp(
          `(### ${insertAfter}[\\s\\S]*?)(?=\\n### |\\n## |$)`
        );
        newUnreleasedContent = unreleasedContent.replace(
          insertPattern,
          `$1${newSection}`
        );
      } else {
        // Insert at the beginning of unreleased content
        newUnreleasedContent = `\n${newSection}${unreleasedContent}`;
      }
    }

    return changelog.replace(
      unreleasedPattern,
      `## [Unreleased]${newUnreleasedContent}`
    );
  }

  /**
   * Release unreleased changes
   */
  releaseVersion(changelog, version) {
    const currentDate = new Date().toISOString().split("T")[0];
    const unreleasedPattern =
      /## \[Unreleased\]([\s\S]*?)(?=## \[|\n---|\n## |$)/;

    const newVersionSection = `## [${version}] - ${currentDate}`;

    return changelog.replace(
      unreleasedPattern,
      `## [Unreleased]\n\n${newVersionSection}$1`
    );
  }

  /**
   * Update package.json version
   */
  updatePackageVersion(version) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(this.packagePath, "utf8"));
      packageJson.version = version;
      fs.writeFileSync(
        this.packagePath,
        JSON.stringify(packageJson, null, 2) + "\n"
      );
      console.log(`📦 Updated package.json version to ${version}`);
    } catch (error) {
      console.log("Could not update package.json version:", error.message);
    }
  }

  /**
   * Main function to update changelog
   */
  updateChangelog(commitMessage = null) {
    // Get commit message
    const message = commitMessage || this.getLatestCommit();

    if (!message) {
      console.log("No commit message to process");
      return false;
    }

    console.log(`📝 Processing commit: ${message.split("\n")[0]}`);

    // Parse commit
    const commit = this.parseCommit(message);

    if (!commit) {
      console.log("💡 Not a conventional commit, skipping changelog update");
      return false;
    }

    // Get type configuration
    const typeConfig = config.types[commit.type];
    if (!typeConfig) {
      console.log(`❓ Unknown commit type: ${commit.type}, skipping`);
      return false;
    }

    // Read current changelog
    let changelog = this.readChangelog();

    // Format entry
    const entry = this.formatCommitEntry(commit);
    if (!entry) {
      console.log("Could not format commit entry");
      return false;
    }

    // Add to appropriate section
    changelog = this.addToUnreleased(changelog, entry, typeConfig.section);

    // Handle version release for significant changes
    if (
      config.autoRelease &&
      (commit.type === "feat" || commit.type === "fix" || commit.isBreaking)
    ) {
      const currentVersion = this.getCurrentVersion();
      const newVersion = this.incrementVersion(
        currentVersion,
        commit.type,
        commit.isBreaking
      );

      if (newVersion !== currentVersion) {
        console.log(`🚀 Auto-releasing version ${newVersion}`);
        changelog = this.releaseVersion(changelog, newVersion);
        this.updatePackageVersion(newVersion);
      }
    }

    // Write updated changelog
    fs.writeFileSync(this.changelogPath, changelog);
    console.log(
      `✅ Updated CHANGELOG.md with ${commit.type}: ${commit.description}`
    );

    // Stage the changelog for commit
    try {
      execSync("git add CHANGELOG.md package.json", { stdio: "ignore" });
      console.log("📋 Staged CHANGELOG.md and package.json");
    } catch (error) {
      console.log("Could not stage files:", error.message);
    }

    return true;
  }
}

// CLI usage
if (require.main === module) {
  const generator = new ChangelogGenerator();
  const commitMessage = process.argv[2];

  try {
    generator.updateChangelog(commitMessage);
  } catch (error) {
    console.error("Error updating changelog:", error.message);
    process.exit(1);
  }
}

module.exports = ChangelogGenerator;
