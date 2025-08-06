# Mbx Homepage CLI Tool

A comprehensive command-line interface for managing your Mbx Homepage Docker deployment with ease.

## Features

- 🚀 **One-command deployment** - Start your entire stack instantly
- 📊 **Real-time status monitoring** - Check container health and access URLs
- 📋 **Live log streaming** - Monitor your application in real-time
- 🔧 **Easy management** - Start, stop, restart with simple commands
- 🐳 **Docker integration** - Full Docker Compose automation
- 🧹 **Cleanup utilities** - Remove containers and volumes safely
- 🎨 **Beautiful output** - Colorized and emoji-enhanced interface

## Installation

The CLI tool is already included in your project. No additional installation required!

## Usage

```bash
./mbx <command>
```

## Commands

### Production Management

| Command   | Description                               | Example         |
| --------- | ----------------------------------------- | --------------- |
| `start`   | 🚀 Deploy and start the production server | `./mbx start`   |
| `stop`    | 🛑 Stop the production server             | `./mbx stop`    |
| `restart` | ⚙️ Restart the production server          | `./mbx restart` |
| `status`  | ℹ️ Show container status and URLs         | `./mbx status`  |

### Development & Monitoring

| Command | Description                           | Example       |
| ------- | ------------------------------------- | ------------- |
| `dev`   | 🌐 Start development server           | `./mbx dev`   |
| `logs`  | 📋 Show live logs from all containers | `./mbx logs`  |
| `build` | 🐳 Build Docker images                | `./mbx build` |

### Maintenance

| Command | Description                          | Example       |
| ------- | ------------------------------------ | ------------- |
| `clean` | ⚠️ Remove all containers and volumes | `./mbx clean` |
| `help`  | Show help message                    | `./mbx help`  |

## Examples

### Quick Start

```bash
# Deploy your application
./mbx start

# Check if everything is running
./mbx status

# View logs
./mbx logs

# Stop when done
./mbx stop
```

### Development Workflow

```bash
# Start development server
./mbx dev

# Or build and test production locally
./mbx build
./mbx start
./mbx status
```

### Maintenance

```bash
# Clean up everything (removes data!)
./mbx clean

# Rebuild and redeploy
./mbx build
./mbx start
```

## Output Examples

### Status Command

```
Container Status:
────────────────────────────────────────────────────────────────────────────────
mbx-homepage-app
  Status: ✅ Running
  Ports:  3001:3000

mbx-homepage-db
  Status: ✅ Running
  Ports:  5433:5432

Access URLs:
────────────────────────────────────────────────────────────────────────────────
🌐 Application: http://localhost:3001
🗄️ Database:    localhost:5433
```

### Start Command

```
🚀 Starting Mbx Homepage...
ℹ️ Running deployment script...
🏗️ Building application...
🗄️ Starting database...
⏳ Waiting for database to be ready...
🚀 Starting application...
✅ Mbx Homepage started successfully!
```

## Configuration Files

The CLI tool uses these configuration files:

- `docker-compose.prod.yml` - Production Docker Compose configuration
- `.env.production` - Production environment variables
- `scripts/deploy.sh` - Deployment script

## Troubleshooting

### Port Conflicts

If you encounter port conflicts, edit `.env.production`:

```bash
APP_PORT=3002        # Change from 3001
POSTGRES_PORT=5434   # Change from 5433
```

### Docker Issues

```bash
# Clean up Docker system
./mbx clean

# Rebuild everything
./mbx build
./mbx start
```

### Permission Issues

```bash
# Make sure scripts are executable
chmod +x mbx mbx-cli.js scripts/deploy.sh
```

## Advanced Usage

### Custom Environment

```bash
# Edit production configuration
nano .env.production

# Apply changes
./mbx restart
```

### Docker Compose Override

```bash
# Use custom compose file
COMPOSE_FILE=docker-compose.custom.yml ./mbx start
```

### Debugging

```bash
# Show detailed logs
./mbx logs | grep ERROR

# Check specific service
docker compose -f docker-compose.prod.yml logs app
```

## Requirements

- Node.js (for CLI tool)
- Docker & Docker Compose
- Bun (for building the application)

## Files Structure

```
.
├── mbx                      # CLI wrapper script
├── mbx-cli.js              # Main CLI implementation
├── docker-compose.prod.yml # Production configuration
├── .env.production         # Environment variables
├── Dockerfile              # Docker build configuration
└── scripts/
    └── deploy.sh           # Deployment automation
```

## Contributing

The CLI tool is written in Node.js and uses native Docker Compose commands. Feel free to extend it with additional features!

## Support

For issues or questions about the CLI tool, check:

1. `./mbx help` for available commands
2. `./mbx status` to check current state
3. `./mbx logs` to see what's happening
