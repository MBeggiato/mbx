#!/bin/bash

# Interactive/CLI Conventional Commit Helper for Mbx OS
# Helps create properly formatted commit messages
# 
# Usage:
#   Interactive: ./commit-helper.sh
#   CLI: ./commit-helper.sh <type_number> [scope] "description" [--breaking "breaking description"]

# Commit types mapping
declare -A commit_types=(
  ["1"]="feat"
  ["2"]="fix"
  ["3"]="docs"
  ["4"]="style"
  ["5"]="refactor"
  ["6"]="perf"
  ["7"]="test"
  ["8"]="chore"
  ["9"]="ci"
  ["10"]="build"
)

declare -A commit_descriptions=(
  ["1"]="✨ A new feature for users"
  ["2"]="� A bug fix"
  ["3"]="📚 Documentation changes"
  ["4"]="💄 Code style changes (formatting, etc.)"
  ["5"]="♻️ Code refactoring (no feature change)"
  ["6"]="⚡ Performance improvements"
  ["7"]="🧪 Adding or updating tests"
  ["8"]="🔧 Maintenance tasks (deps, build, etc.)"
  ["9"]="👷 CI/CD pipeline changes"
  ["10"]="📦 Build system changes"
)

# Function to show usage
show_usage() {
  echo "�🚀 Mbx OS Conventional Commit Helper"
  echo "======================================"
  echo ""
  echo "Usage:"
  echo "  Interactive mode: bun run commit"
  echo "  CLI mode: bun run commit <type> [scope] \"description\" [--breaking \"breaking description\"]"
  echo ""
  echo "Types:"
  for key in {1..10}; do
    printf "  %2s) %s %s\n" "$key" "${commit_types[$key]}" "${commit_descriptions[$key]}"
  done
  echo ""
  echo "Examples:"
  echo "  bun run commit 1 settings \"add user preferences\""
  echo "  bun run commit 2 \"fix navigation bug\""
  echo "  bun run commit 1 api \"add new endpoint\" --breaking \"changed API response format\""
}

# Function to validate git repository and staged changes
validate_git() {
  # Check if we're in a git repository
  if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
  fi

  # Check for staged changes
  if git diff --cached --quiet; then
    echo "❌ Error: No staged changes found"
    echo "💡 Please stage your changes first with: git add <files>"
    exit 1
  fi
}

# Function to create commit message
create_commit() {
  local type="$1"
  local scope="$2"
  local description="$3"
  local breaking_desc="$4"
  
  # Validate type
  if [[ ! "${commit_types[$type]}" ]]; then
    echo "❌ Error: Invalid commit type '$type'. Use numbers 1-10."
    exit 1
  fi
  
  # Validate description
  if [[ -z "$description" ]]; then
    echo "❌ Error: Description is required"
    exit 1
  fi
  
  # Build commit message components
  local commit_type="${commit_types[$type]}"
  local scope_part=""
  local breaking_suffix=""
  
  if [[ -n "$scope" ]]; then
    scope_part="($scope)"
  fi
  
  if [[ -n "$breaking_desc" ]]; then
    breaking_suffix="!"
  fi
  
  # Build the full commit message
  local commit_msg="${commit_type}${scope_part}${breaking_suffix}: ${description}"
  
  if [[ -n "$breaking_desc" ]]; then
    commit_msg="${commit_msg}

BREAKING CHANGE: ${breaking_desc}"
  fi
  
  echo "$commit_msg"
}

# Function for interactive mode
interactive_mode() {
  echo "� Mbx OS Conventional Commit Helper"
  echo "======================================"
  
  echo ""
  echo "📝 Staged files:"
  git diff --cached --name-only | sed 's/^/  - /'
  echo ""

  # Display commit types
  echo "🏷️  Select commit type:"
  echo ""
  for key in {1..10}; do
    printf "  %2s) %s %s\n" "$key" "${commit_types[$key]}" "${commit_descriptions[$key]}"
  done
  echo ""

  # Get commit type
  while true; do
    read -p "Enter number (1-10): " choice
    if [[ "$choice" =~ ^[1-9]$|^10$ ]]; then
      selected_type="$choice"
      break
    else
      echo "❌ Invalid choice. Please enter a number between 1-10."
    fi
  done

  echo ""

  # Get scope (optional)
  echo "🎯 Scope (optional - e.g., auth, ui, api):"
  read -p "Enter scope (or press Enter to skip): " scope

  echo ""

  # Get description
  echo "📝 Description:"
  echo "💡 Tip: Use imperative mood (add, fix, update) and keep it concise"
  while true; do
    read -p "Enter description: " description
    if [[ -n "$description" ]]; then
      break
    else
      echo "❌ Description is required"
    fi
  done

  echo ""

  # Check for breaking changes
  echo "💥 Breaking changes?"
  read -p "Is this a breaking change? (y/N): " breaking
  local breaking_desc=""
  if [[ "$breaking" =~ ^[Yy]$ ]]; then
    echo "⚠️  Please describe the breaking change:"
    read -p "Breaking change description: " breaking_desc
  fi

  # Create commit message
  local commit_msg
  commit_msg=$(create_commit "$selected_type" "$scope" "$description" "$breaking_desc")

  # Show preview
  echo ""
  echo "📋 Commit message preview:"
  echo "=========================="
  echo "$commit_msg"
  echo "=========================="
  echo ""

  # Confirm and commit
  read -p "✅ Commit with this message? (Y/n): " confirm
  if [[ "$confirm" =~ ^[Nn]$ ]]; then
    echo "❌ Commit cancelled"
    exit 0
  fi

  # Execute commit
  execute_commit "$commit_msg"
}

# Function to execute the git commit
execute_commit() {
  local commit_msg="$1"
  
  echo ""
  echo "🚀 Creating commit..."

  if git commit -m "$commit_msg"; then
    echo "✅ Commit created successfully!"
    echo ""
    echo "📊 Recent commits:"
    git log --oneline -3
    echo ""
    echo "💡 Next steps:"
    echo "  - Review your changes: git show"
    echo "  - Push to remote: git push"
    echo "  - Create pull request if needed"
  else
    echo "❌ Commit failed"
    exit 1
  fi
}

# Main script logic
# Check for help first before validating git
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
  show_usage
  exit 0
fi

validate_git

# Check if arguments provided for CLI mode
if [[ $# -eq 0 ]]; then
  # Interactive mode
  interactive_mode
else
  # CLI mode
  
  # Parse CLI arguments
  type="$1"
  shift
  
  # Parse remaining arguments
  scope=""
  description=""
  breaking_desc=""
  
  # Check if next argument looks like a scope (no quotes, short)
  if [[ $# -gt 1 && "$1" != --* && ${#1} -lt 20 && "$1" != *" "* ]]; then
    scope="$1"
    shift
  fi
  
  # Get description (required)
  if [[ $# -gt 0 && "$1" != --* ]]; then
    description="$1"
    shift
  else
    echo "❌ Error: Description is required"
    echo "Usage: bun run commit <type> [scope] \"description\""
    exit 1
  fi
  
  # Parse breaking change if provided
  if [[ "$1" == "--breaking" && $# -gt 1 ]]; then
    breaking_desc="$2"
    shift 2
  fi
  
  # Create commit message
  commit_msg=$(create_commit "$type" "$scope" "$description" "$breaking_desc")
  
  # Show what we're about to commit
  echo "🚀 Mbx OS Conventional Commit Helper (CLI Mode)"
  echo "================================================"
  echo ""
  echo "📝 Staged files:"
  git diff --cached --name-only | sed 's/^/  - /'
  echo ""
  echo "📋 Commit message:"
  echo "$commit_msg"
  echo ""
  
  # Execute commit
  execute_commit "$commit_msg"
fi
