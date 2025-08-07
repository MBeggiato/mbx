#!/usr/bin/env node

/**
 * Release Script for Mbx OS
 * Creates a new release by moving unreleased changes to a versioned section
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class ReleaseManager {
  constructor() {
    this.changelogPath = path.join(process.cwd(), "CHANGELOG.md");
    this.packagePath = path.join(process.cwd(), "package.json");
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
   * Increment version based on release type
   */
  incrementVersion(currentVersion, releaseType) {
    const [major, minor, patch] = currentVersion.split(".").map(Number);

    switch (releaseType) {
      case "major":
        return `${major + 1}.0.0`;
      case "minor":
        return `${major}.${minor + 1}.0`;
      case "patch":
        return `${major}.${minor}.${patch + 1}`;
      default:
        throw new Error(
          `Invalid release type: ${releaseType}. Use major, minor, or patch.`
        );
    }
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
      throw new Error(`Could not update package.json: ${error.message}`);
    }
  }

  /**
   * Read current changelog
   */
  readChangelog() {
    try {
      return fs.readFileSync(this.changelogPath, "utf8");
    } catch (error) {
      throw new Error(`Could not read CHANGELOG.md: ${error.message}`);
    }
  }

  /**
   * Check if there are unreleased changes
   */
  hasUnreleasedChanges(changelog) {
    const unreleasedPattern =
      /## \[Unreleased\]([\s\S]*?)(?=## \[|\n---|\n## |$)/;
    const match = changelog.match(unreleasedPattern);

    if (!match) return false;

    const unreleasedContent = match[1].trim();

    // Check if there's any content other than just section headers
    const contentWithoutHeaders = unreleasedContent
      .replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)/g, "")
      .trim();

    return contentWithoutHeaders.length > 0;
  }

  /**
   * Create release section in changelog
   */
  createReleaseSection(changelog, version, releaseNotes) {
    const currentDate = new Date().toISOString().split("T")[0];
    const unreleasedPattern =
      /## \[Unreleased\]([\s\S]*?)(?=## \[|\n---|\n## |$)/;

    const match = changelog.match(unreleasedPattern);
    if (!match) {
      throw new Error("Could not find Unreleased section in changelog");
    }

    const unreleasedContent = match[1];

    // Create new version section with the unreleased content
    let newVersionSection = `## [${version}] - ${currentDate}`;

    // Add release notes if provided
    if (releaseNotes) {
      newVersionSection += `\n\n${releaseNotes}`;
    }

    newVersionSection += unreleasedContent;

    // Replace unreleased section with empty one and add new version
    const updatedChangelog = changelog.replace(
      unreleasedPattern,
      `## [Unreleased]\n\n${newVersionSection}`
    );

    return updatedChangelog;
  }

  /**
   * Generate release notes based on changes
   */
  generateReleaseNotes(changelog, version, releaseType) {
    const unreleasedPattern =
      /## \[Unreleased\]([\s\S]*?)(?=## \[|\n---|\n## |$)/;
    const match = changelog.match(unreleasedPattern);

    if (!match) return null;

    const unreleasedContent = match[1];

    // Count changes by type
    const addedMatches =
      unreleasedContent.match(/### Added([\s\S]*?)(?=### |$)/g) || [];
    const changedMatches =
      unreleasedContent.match(/### Changed([\s\S]*?)(?=### |$)/g) || [];
    const fixedMatches =
      unreleasedContent.match(/### Fixed([\s\S]*?)(?=### |$)/g) || [];

    const addedCount =
      addedMatches.length > 0
        ? (addedMatches[0].match(/^- /gm) || []).length
        : 0;
    const changedCount =
      changedMatches.length > 0
        ? (changedMatches[0].match(/^- /gm) || []).length
        : 0;
    const fixedCount =
      fixedMatches.length > 0
        ? (fixedMatches[0].match(/^- /gm) || []).length
        : 0;

    // Generate release title and description
    const releaseTitle = this.getReleaseTitle(
      version,
      releaseType,
      addedCount,
      fixedCount,
      changedCount
    );
    const releaseDescription = this.getReleaseDescription(
      releaseType,
      addedCount,
      fixedCount,
      changedCount
    );

    return `### ${releaseTitle}\n\n${releaseDescription}`;
  }

  /**
   * Get release title based on content
   */
  getReleaseTitle(version, releaseType, addedCount, fixedCount, changedCount) {
    const titles = {
      major: [
        "Breaking Changes & New Architecture",
        "Major Platform Update",
        "Revolutionary Features",
      ],
      minor: [
        "Feature-Rich Update",
        "Enhanced Functionality",
        "New Capabilities",
        "Productivity Improvements",
        "Feature Enhancement",
      ],
      patch: [
        "Bug Fixes & Improvements",
        "Stability Update",
        "Polish & Refinements",
        "Quality Improvements",
      ],
    };

    // Select title based on primary change type
    if (addedCount > fixedCount && addedCount > changedCount) {
      return titles[releaseType][
        Math.floor(Math.random() * titles[releaseType].length)
      ];
    } else if (fixedCount > 0) {
      return titles.patch[Math.floor(Math.random() * titles.patch.length)];
    } else {
      return titles[releaseType][0];
    }
  }

  /**
   * Get release description
   */
  getReleaseDescription(releaseType, addedCount, fixedCount, changedCount) {
    const total = addedCount + fixedCount + changedCount;

    let description = `This ${releaseType} release includes ${total} change${
      total !== 1 ? "s" : ""
    }`;

    const parts = [];
    if (addedCount > 0)
      parts.push(`${addedCount} new feature${addedCount !== 1 ? "s" : ""}`);
    if (fixedCount > 0)
      parts.push(`${fixedCount} bug fix${fixedCount !== 1 ? "es" : ""}`);
    if (changedCount > 0)
      parts.push(`${changedCount} improvement${changedCount !== 1 ? "s" : ""}`);

    if (parts.length > 0) {
      description += ` with ${parts.join(", ")}.`;
    } else {
      description += ".";
    }

    // Add context based on release type
    switch (releaseType) {
      case "major":
        description += " Please review any breaking changes before upgrading.";
        break;
      case "minor":
        description += " Enjoy the new features and enhanced functionality!";
        break;
      case "patch":
        description +=
          " This update improves stability and fixes reported issues.";
        break;
    }

    return description;
  }

  /**
   * Create git tag for release
   */
  createGitTag(version, changelog) {
    try {
      // Extract release notes for this version
      const versionPattern = new RegExp(
        `## \\[${version.replace(
          /\./g,
          "\\."
        )}\\][\\s\\S]*?(?=## \\[|\\n---|\\n## |$)`
      );
      const match = changelog.match(versionPattern);

      let tagMessage = `Release ${version}`;
      if (match) {
        // Use first few lines of release notes as tag message
        const releaseContent = match[0];
        const lines = releaseContent.split("\n").slice(1, 4); // Skip version line, take next 3
        const summary = lines
          .filter((line) => line.trim())
          .slice(0, 2)
          .join("\n");
        if (summary) {
          tagMessage += `\n\n${summary}`;
        }
      }

      execSync(`git tag -a v${version} -m "${tagMessage}"`, {
        stdio: "inherit",
      });
      console.log(`🏷️  Created git tag v${version}`);
    } catch (error) {
      console.warn(`⚠️  Could not create git tag: ${error.message}`);
    }
  }

  /**
   * Main release function
   */
  async performRelease(releaseType, customVersion = null, releaseNotes = null) {
    console.log(`🚀 Creating ${releaseType} release...`);

    // Read current state
    const currentVersion = this.getCurrentVersion();
    const changelog = this.readChangelog();

    // Check for unreleased changes
    if (!this.hasUnreleasedChanges(changelog)) {
      console.log("❌ No unreleased changes found. Add some changes first!");
      return false;
    }

    // Calculate new version
    const newVersion =
      customVersion || this.incrementVersion(currentVersion, releaseType);
    console.log(`📈 Version: ${currentVersion} → ${newVersion}`);

    // Generate or use provided release notes
    const notes =
      releaseNotes ||
      this.generateReleaseNotes(changelog, newVersion, releaseType);

    // Update changelog
    const updatedChangelog = this.createReleaseSection(
      changelog,
      newVersion,
      notes
    );
    fs.writeFileSync(this.changelogPath, updatedChangelog);
    console.log(`📝 Updated CHANGELOG.md with release ${newVersion}`);

    // Update package.json
    this.updatePackageVersion(newVersion);

    // Update public changelog for the app
    try {
      const publicChangelogPath = path.join(
        process.cwd(),
        "public",
        "CHANGELOG.md"
      );
      fs.writeFileSync(publicChangelogPath, updatedChangelog);
      console.log(`📋 Updated public/CHANGELOG.md`);
    } catch (error) {
      console.warn(`⚠️  Could not update public changelog: ${error.message}`);
    }

    // Stage files
    try {
      execSync("git add CHANGELOG.md package.json public/CHANGELOG.md", {
        stdio: "ignore",
      });
      console.log(`📦 Staged release files`);
    } catch (error) {
      console.warn(`⚠️  Could not stage files: ${error.message}`);
    }

    console.log(`✅ Release ${newVersion} created successfully!`);
    console.log(`\n🔄 Next steps:`);
    console.log(`   1. Review the changes: git diff --cached`);
    console.log(
      `   2. Commit the release: git commit -m "chore: release ${newVersion}"`
    );
    console.log(`   3. Push to remote: git push`);
    console.log(
      `   4. Create git tag: git tag v${newVersion} && git push --tags`
    );

    return true;
  }
}

// CLI usage
if (require.main === module) {
  const releaseType = process.argv[2];
  const customVersion = process.argv[3];
  const releaseNotes = process.argv[4];

  if (!releaseType || !["major", "minor", "patch"].includes(releaseType)) {
    console.log(`
🚀 Mbx OS Release Manager

Usage: npm run release <type> [version] [notes]

Release Types:
  major    - Breaking changes (1.0.0 → 2.0.0)
  minor    - New features (1.0.0 → 1.1.0)  
  patch    - Bug fixes (1.0.0 → 1.0.1)

Examples:
  npm run release minor
  npm run release patch
  npm run release major "2.0.0" "Major rewrite with new architecture"

Current unreleased changes will be moved to the new version section.
`);
    process.exit(1);
  }

  const manager = new ReleaseManager();

  manager
    .performRelease(releaseType, customVersion, releaseNotes)
    .then((success) => {
      if (!success) {
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("❌ Release failed:", error.message);
      process.exit(1);
    });
}

module.exports = ReleaseManager;
