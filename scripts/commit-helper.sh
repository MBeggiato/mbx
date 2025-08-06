#!/bin/bash

# Interactive Conventional Commit Helper for Mbx OS
# Helps create properly formatted commit messages

echo "🚀 Mbx OS Conventional Commit Helper"
echo "======================================"

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

echo ""
echo "📝 Staged files:"
git diff --cached --name-only | sed 's/^/  - /'
echo ""

# Commit types with descriptions
declare -A commit_types=(
  ["1"]="feat:✨ A new feature for users"
  ["2"]="fix:🐛 A bug fix"
  ["3"]="docs:📚 Documentation changes"
  ["4"]="style:💄 Code style changes (formatting, etc.)"
  ["5"]="refactor:♻️ Code refactoring (no feature change)"
  ["6"]="perf:⚡ Performance improvements"
  ["7"]="test:🧪 Adding or updating tests"
  ["8"]="chore:🔧 Maintenance tasks (deps, build, etc.)"
  ["9"]="ci:👷 CI/CD pipeline changes"
  ["10"]="build:📦 Build system changes"
)

# Display commit types
echo "🏷️  Select commit type:"
echo ""
for key in {1..10}; do
  IFS=':' read -r type desc <<< "${commit_types[$key]}"
  printf "  %2s) %s %s\n" "$key" "$type" "$desc"
done
echo ""

# Get commit type
while true; do
  read -p "Enter number (1-10): " choice
  if [[ "$choice" =~ ^[1-9]$|^10$ ]]; then
    IFS=':' read -r selected_type _ <<< "${commit_types[$choice]}"
    break
  else
    echo "❌ Invalid choice. Please enter a number between 1-10."
  fi
done

echo ""

# Get scope (optional)
echo "🎯 Scope (optional - e.g., auth, ui, api):"
read -p "Enter scope (or press Enter to skip): " scope

# Format scope
if [[ -n "$scope" ]]; then
  scope="($scope)"
else
  scope=""
fi

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
if [[ "$breaking" =~ ^[Yy]$ ]]; then
  breaking_suffix="!"
  echo "⚠️  Please describe the breaking change:"
  read -p "Breaking change description: " breaking_desc
else
  breaking_suffix=""
  breaking_desc=""
fi

echo ""

# Build commit message
commit_msg="${selected_type}${scope}${breaking_suffix}: ${description}"

if [[ -n "$breaking_desc" ]]; then
  commit_msg="${commit_msg}

BREAKING CHANGE: ${breaking_desc}"
fi

# Show preview
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

# Create the commit
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
