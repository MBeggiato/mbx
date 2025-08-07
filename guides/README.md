# Mbx OS Development Guides

Welcome to the Mbx OS development documentation! This folder contains comprehensive guides for developers working with the Mbx OS project.

## 📚 Available Guides

### [🚀 Developer Guide](DEVELOPER_GUIDE.md)

**Complete guide for creating new applications**

- App architecture and component structure
- Step-by-step app creation process
- Window system integration
- File system integration
- Styling guidelines and best practices
- Working examples and troubleshooting

### [📝 Changelog & Commit Guide](CHANGELOG_GUIDE.md)

**Automated changelog and conventional commit system**

- Conventional commit message format
- Automated changelog generation
- Git hooks and workflow setup
- Interactive commit helper tools
- Best practices and examples

## 🎯 Quick Start

### For New Developers

1. **Read the [Developer Guide](DEVELOPER_GUIDE.md)** to understand the system architecture
2. **Set up the changelog system** following the [Changelog Guide](CHANGELOG_GUIDE.md)
3. **Create your first app** using the step-by-step instructions

### Essential Commands

```bash
# Set up automated changelog
bun run setup:hooks

# Create commits with helper
bun run commit

# Update changelog manually
bun run changelog:update

# Build and test
bun run build
bun run dev
```

## 🛠️ Development Workflow

### 1. **Set Up Development Environment**

```bash
# Clone and install
git clone <repository-url>
cd mbx-os
bun install

# Configure git hooks
bun run setup:hooks
```

### 2. **Create New App**

- Follow the [Developer Guide](DEVELOPER_GUIDE.md) for complete instructions
- Use the provided templates and examples
- Test your app in the development environment

### 3. **Commit Changes**

```bash
# Stage your changes
git add .

# Use interactive commit helper (recommended)
bun run commit

# Or create conventional commit manually
git commit -m "feat(apps): add new productivity app"
```

### 4. **Documentation and Testing**

- Update relevant documentation
- Test your changes thoroughly
- Ensure all builds pass: `bun run build`

## 📋 Project Structure

```
mbx-os/
├── guides/                    # 📚 This folder - Development guides
│   ├── README.md             # This file
│   ├── DEVELOPER_GUIDE.md    # App development guide
│   └── CHANGELOG_GUIDE.md    # Changelog and commit guide
├── components/
│   └── apps/                 # 🚀 Your apps go here
├── scripts/
│   ├── update-changelog.js   # 🤖 Automated changelog system
│   └── commit-helper.sh      # 💬 Interactive commit tool
├── .githooks/
│   └── pre-commit           # 🔄 Automated git hook
├── changelog.config.js       # ⚙️ Changelog configuration
└── CHANGELOG.md             # 📝 Project changelog
```

## 🎨 Development Principles

### **Consistency**

- Follow established patterns and conventions
- Use the provided UI components and styling system
- Maintain consistent file and component naming

### **Quality**

- Write clean, readable code with proper TypeScript types
- Implement proper error handling and loading states
- Test your changes across different screen sizes

### **Documentation**

- Use conventional commit messages
- Update relevant documentation when adding features
- Comment complex logic and provide examples

### **Collaboration**

- Follow the conventional commit format
- Create descriptive pull request descriptions
- Review the guides before making significant changes

## 🤝 Contributing Guidelines

### **Before You Start**

1. Read both guides thoroughly
2. Set up your development environment
3. Understand the project architecture
4. Configure the automated changelog system

### **During Development**

1. Create feature branches for significant changes
2. Use conventional commit messages
3. Test your changes thoroughly
4. Update documentation as needed

### **Before Submitting**

1. Ensure all builds pass (`bun run build`)
2. Verify your changelog entries are correct
3. Test responsive behavior
4. Follow the code review checklist

## 🆘 Getting Help

### **Common Issues**

- Check the troubleshooting sections in each guide
- Verify your development environment setup
- Review recent commits for similar implementations

### **Resources**

- **Developer Guide**: For app development questions
- **Changelog Guide**: For commit and documentation questions
- **Project README**: For general project information
- **Component Documentation**: For UI component usage

### **Best Practices**

1. **Start Small**: Begin with simple apps to understand the system
2. **Follow Examples**: Use the provided examples as templates
3. **Test Frequently**: Run `bun run dev` to test your changes
4. **Ask Questions**: Review existing code for patterns and solutions

## 🚀 What's Next?

1. **Read the guides** to understand the development workflow
2. **Set up your environment** with the automated tools
3. **Create your first app** following the step-by-step instructions
4. **Contribute improvements** to help the project grow

---

Happy coding! 🎉

**Last Updated**: August 6, 2025  
**Mbx OS Version**: 1.2.0
