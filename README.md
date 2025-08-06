# Mbx Homepage - Modern Desktop OS Simulation

A sophisticated desktop operating system simulation built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. Features a complete windowing system, applications, and interactive desktop environment.

![Mbx Homepage Screenshot](screenshots/01.png)

## 🚀 Quick Start wit## 🐳 Production Deployment

### Easy CLI Management

The fastest way to deploy is using our CLI tool:

```bash
# Quick deployment
./mbx start

# Check deployment status
./mbx status

# View application logs
./mbx logs

# Stop deployment
./mbx stop
```

For detailed CLI documentation, see [CLI-README.md](CLI-README.md).

### Manual Docker Production Setup

1. **Prepare Environment**

   ```bash
   # Copy and edit production environment
   cp .env.example .env.production
   # Edit .env.production with your production values
   ```

2. **Deploy with Docker**

   ```bash
   # Using CLI tool (recommended)
   ./mbx start

   # Or manually with deployment script
   chmod +x scripts/deploy.shasiest way to manage your Mbx Homepage is with our built-in CLI tool:
   ```

```bash
# Start the application
./mbx start

# Check status
./mbx status

# View logs
./mbx logs

# Stop the application
./mbx stop
```

See [CLI Documentation](CLI-README.md) for all available commands.

## ✨ Features

### 🖥️ **Desktop Environment**

- **Modern Window Management** - Resizable, draggable windows with minimize/maximize/close
- **Interactive Taskbar** - Application shortcuts and window management
- **Start Menu** - Organized application launcher with categories
- **Desktop Icons** - Quick access to main applications
- **URL State Sharing** - Share your desktop state with others via URL

### 🎵 **Music Player Pro**

- **Professional Audio Player** - Built with react-h5-audio-player
- **Dual Layout Modes** - Compact and fullscreen views with manual toggle
- **Volume Persistence** - Remembers your volume settings
- **Auto-Resume** - Continues playback from where you left off
- **Responsive Design** - Adapts to different window sizes
- **Track Navigation** - Next/previous with shuffle and repeat modes

### 📱 **Applications**

- **About Me** - Personal information and bio
- **Projects** - Portfolio showcase with project details
- **Contact** - Contact information and social links
- **Guestbook** - Interactive visitor comments with content moderation
- **Calculator** - Fully functional calculator with advanced operations
- **Photo Viewer** - Image gallery with navigation
- **Games** - Mini-games collection (Tic-tac-toe, Memory, Snake, Rock Paper Scissors)
- **Browser** - Embedded web browser simulation
- **Downloads** - File manager with Easter eggs
- **Secret Console** - Hidden developer features and Easter eggs

### 🎭 **Easter Eggs & Special Features**

- **Konami Code** - Activate Matrix mode (↑↑↓↓←→←→BA)
- **Keyboard Shortcuts** - Various hidden shortcuts (Ctrl+Alt+D, Ctrl+N, etc.)
- **Party Mode** - Animated background effects (Shift+Ctrl+P)
- **Neon Mode** - Cyberpunk-style visual theme
- **Time-based Messages** - Different greetings based on time of day
- **Secret Window** - Hidden developer console with system information
- **Interactive Elements** - Click counters, hidden file interactions

### 🛡️ **Content Moderation**

- **AI-Powered Filtering** - Automatic content screening for inappropriate content
- **Bad Words Detection** - Multi-language profanity filtering
- **Spam Protection** - Rate limiting and input validation
- **Clean User Experience** - Maintains family-friendly environment

### 🎨 **Design & UX**

- **Modern Glassmorphism** - Translucent window effects
- **Smooth Animations** - Fluid transitions and interactions
- **Responsive Layout** - Works on desktop and tablet devices
- **Dark/Light Themes** - Multiple visual modes
- **Accessibility** - Keyboard navigation support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm
- Docker and Docker Compose (for database)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mbx-homepage

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env file with your preferred credentials

# Start the database (PostgreSQL + pgAdmin)
docker compose up -d

# Run the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🐳 Docker Services

The project includes a complete Docker Compose setup with configurable environment variables:

#### Database Services:

- **PostgreSQL** (configurable port, default: 5433) - Main database for guestbook and user data
- **pgAdmin** (configurable port, default: 5050) - Database administration interface

#### Environment Configuration:

All database credentials and ports are configurable via the `.env` file:

```env
# Database Configuration
POSTGRES_DB=guestbook
POSTGRES_USER=mbx
POSTGRES_PASSWORD=mbx123
POSTGRES_PORT=5433

# pgAdmin Configuration
PGADMIN_DEFAULT_EMAIL=admin@mbx.com
PGADMIN_DEFAULT_PASSWORD=admin123
PGADMIN_PORT=5050
```

#### Quick Docker Commands:

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Reset database (removes all data)
docker compose down -v
docker compose up -d
```

#### pgAdmin Access:

- URL: http://localhost:{PGADMIN_PORT} (default: 5050)
- Email: {PGADMIN_DEFAULT_EMAIL} (from .env)
- Password: {PGADMIN_DEFAULT_PASSWORD} (from .env)
- Server: postgres (host), port 5432, user: {POSTGRES_USER}, password: {POSTGRES_PASSWORD}

### Adding Music Files

1. Place your music files (MP3, WAV, OGG, M4A) in `public/music/`
2. Edit the `sampleTracks` array in `components/apps/MusicPlayerAppPro.tsx`
3. Add track information following the provided format

## 🏗️ Tech Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Runtime**: Bun (JavaScript runtime and package manager)
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Custom component library with Lucide React icons
- **Audio**: react-h5-audio-player for professional music playback
- **Database**: PostgreSQL with connection pooling
- **Infrastructure**: Docker Compose for local development
- **Deployment**: Optimized for Vercel deployment

## 📁 Project Structure

```
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── page.tsx          # Main desktop system
├── components/            # React components
│   ├── apps/             # Desktop applications
│   ├── ui/               # Reusable UI components
│   ├── Desktop.tsx       # Desktop icons
│   ├── Taskbar.tsx       # Bottom taskbar
│   └── StartMenu.tsx     # Application launcher
├── lib/                   # Utility functions
├── public/               # Static assets
│   └── music/           # Music files directory
├── database/             # Database schemas and init scripts
├── docker-compose.yml    # Docker services configuration
├── .env.example         # Environment variables template
├── scripts/             # Utility scripts
│   └── check-config.sh  # Configuration checker
└── bun.lock             # Bun lockfile
```

## 🎯 Key Applications

### Music Player Pro

- Professional audio player with react-h5-audio-player
- Fullscreen and compact view modes
- Persistent volume and playback position
- Shuffle, repeat, and auto-resume features

### Guestbook

- Real-time comment system
- Content moderation
- Responsive design with smooth animations
- Database integration for persistent storage

### Game Center

- Multiple mini-games in one application
- Local high score tracking
- Responsive game controls
- Classic games: Snake, Memory, Tic-tac-toe, Rock Paper Scissors

## 🛠️ Development

### Building for Production

```bash
bun run build
bun start
```

### Environment Variables

Create a `.env` file from the example and configure your settings:

```bash
cp .env.example .env
```

```env
# Database Configuration
POSTGRES_DB=guestbook
POSTGRES_USER=mbx
POSTGRES_PASSWORD=mbx123
POSTGRES_PORT=5433

# pgAdmin Configuration
PGADMIN_DEFAULT_EMAIL=admin@mbx.com
PGADMIN_DEFAULT_PASSWORD=admin123
PGADMIN_PORT=5050

# Application Database URL (automatically constructed)
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}

# Optional: Application Configuration
NEXT_PUBLIC_APP_NAME="Mbx Homepage"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Optional: Future AI Content Moderation
# OPENAI_API_KEY=your_openai_api_key_here
# CONTENT_MODERATION_ENABLED=true
```

### Development Workflow

```bash
# Copy and configure environment variables
cp .env.example .env
# Edit .env with your preferred settings

# Check your configuration (optional)
./scripts/check-config.sh

# Start database services
docker compose up -d

# Install dependencies
bun install

# Run development server
bun dev

# Run linting
bun run lint

# Build for production
bun run build
```

## 🌟 Notable Features

- **Window State Persistence** - Your desktop layout is saved in the URL
- **Professional Audio Experience** - High-quality music playbook with full controls
- **Easter Egg System** - Hidden features and developer jokes throughout
- **Content Safety** - AI moderation keeps the platform family-friendly
- **Performance Optimized** - Fast loading with code splitting and optimization
- **Mobile Responsive** - Adapts to different screen sizes and touch inputs
- **Environment Configuration** - Fully configurable via .env files
- **Secure Defaults** - No hardcoded credentials or sensitive data

## 🔒 Security & Configuration

### Environment Variables

- **All credentials are configurable** - No hardcoded passwords or API keys
- **Secure defaults** - Strong default passwords that should be changed in production
- **Environment isolation** - Separate .env files for different deployment environments
- **Git-ignored** - .env files are automatically excluded from version control

### Production Deployment

- Change all default passwords in your production .env file
- Use strong, unique passwords for database and admin accounts
- Enable SSL for database connections in production
- Consider using managed database services for production deployments

## � Production Deployment

### Docker Production Setup

1. **Prepare Environment**

   ```bash
   # Copy and edit production environment
   cp .env.example .env.production
   # Edit .env.production with your production values
   ```

2. **Deploy with Docker**

   ```bash
   # Make deployment script executable
   chmod +x scripts/deploy.sh

   # Run deployment
   ./scripts/deploy.sh
   ```

3. **Manual Deployment Steps**

   ```bash
   # Build and start services
   docker compose -f docker-compose.prod.yml up -d

   # View logs
   docker compose -f docker-compose.prod.yml logs -f

   # Stop services
   docker compose -f docker-compose.prod.yml down
   ```

### SSL Setup (Optional)

For HTTPS support with custom domain:

```bash
# Setup SSL certificates
chmod +x scripts/ssl-setup.sh
./scripts/ssl-setup.sh your-domain.com

# Start with nginx proxy
docker compose -f docker-compose.prod.yml --profile proxy up -d
```

### Server Requirements

- **RAM**: Minimum 1GB, recommended 2GB+
- **Storage**: Minimum 5GB, recommended 10GB+
- **CPU**: 1 core minimum, 2+ cores recommended
- **Ports**: 80, 443 (for web), 5432 (for database)

### Environment Variables for Production

```env
# Application
APP_PORT=3000
NODE_ENV=production

# Database
POSTGRES_DB=mbx_homepage
POSTGRES_USER=mbx_prod
POSTGRES_PASSWORD=your_secure_password

# Domain (for SSL)
DOMAIN=your-domain.com
SSL_EMAIL=admin@your-domain.com
```

### Health Checks

```bash
# Check application status
curl http://localhost:3000

# Check database connection
docker compose -f docker-compose.prod.yml exec db pg_isready

# View container status
docker compose -f docker-compose.prod.yml ps
```

## �📜 License

This project is for portfolio demonstration purposes. Please respect the original music files' licenses when adding your own content.

## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome!

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
