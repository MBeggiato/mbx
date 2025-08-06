#!/usr/bin/env node

const { spawn, exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// Emoji icons
const icons = {
  rocket: "🚀",
  stop: "🛑",
  info: "ℹ️",
  check: "✅",
  cross: "❌",
  warning: "⚠️",
  gear: "⚙️",
  logs: "📋",
  database: "🗄️",
  web: "🌐",
  docker: "🐳",
};

class MbxCLI {
  constructor() {
    this.dockerComposeFile = "docker-compose.prod.yml";
    this.envFile = ".env.production";
  }

  log(message, color = colors.reset, icon = "") {
    console.log(`${color}${icon} ${message}${colors.reset}`);
  }

  error(message) {
    this.log(message, colors.red, icons.cross);
  }

  success(message) {
    this.log(message, colors.green, icons.check);
  }

  info(message) {
    this.log(message, colors.blue, icons.info);
  }

  warning(message) {
    this.log(message, colors.yellow, icons.warning);
  }

  async runCommand(command, description) {
    return new Promise((resolve, reject) => {
      this.info(`${description}...`);

      const child = spawn("sh", ["-c", command], {
        stdio: "inherit",
        cwd: process.cwd(),
      });

      child.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with exit code ${code}`));
        }
      });

      child.on("error", (error) => {
        reject(error);
      });
    });
  }

  async checkDockerCompose() {
    if (!fs.existsSync(this.dockerComposeFile)) {
      this.error(`Docker Compose file '${this.dockerComposeFile}' not found!`);
      process.exit(1);
    }
  }

  async getContainerStatus() {
    return new Promise((resolve) => {
      exec(
        `docker compose -f ${this.dockerComposeFile} ps --format json`,
        (error, stdout) => {
          if (error) {
            resolve([]);
            return;
          }

          try {
            const lines = stdout
              .trim()
              .split("\n")
              .filter((line) => line.trim());
            const containers = lines.map((line) => JSON.parse(line));
            resolve(containers);
          } catch (e) {
            resolve([]);
          }
        }
      );
    });
  }

  async start() {
    try {
      await this.checkDockerCompose();
      this.log(`${icons.rocket} Starting Mbx Homepage...`, colors.cyan);
      await this.runCommand("./scripts/deploy.sh", "Running deployment script");
      this.success("Mbx Homepage started successfully!");
      await this.status();
    } catch (error) {
      this.error(`Failed to start: ${error.message}`);
      process.exit(1);
    }
  }

  async stop() {
    try {
      await this.checkDockerCompose();
      this.log(`${icons.stop} Stopping Mbx Homepage...`, colors.yellow);
      await this.runCommand(
        `docker compose -f ${this.dockerComposeFile} down`,
        "Stopping all containers"
      );
      this.success("Mbx Homepage stopped successfully!");
    } catch (error) {
      this.error(`Failed to stop: ${error.message}`);
      process.exit(1);
    }
  }

  async restart() {
    try {
      await this.checkDockerCompose();
      this.log(`${icons.gear} Restarting Mbx Homepage...`, colors.magenta);
      await this.runCommand(
        `docker compose -f ${this.dockerComposeFile} restart`,
        "Restarting all containers"
      );
      this.success("Mbx Homepage restarted successfully!");
      await this.status();
    } catch (error) {
      this.error(`Failed to restart: ${error.message}`);
      process.exit(1);
    }
  }

  async status() {
    try {
      await this.checkDockerCompose();
      this.log(`${icons.info} Checking status...`, colors.blue);

      const containers = await this.getContainerStatus();

      if (containers.length === 0) {
        this.warning("No containers are running");
        return;
      }

      console.log("\n" + colors.bright + "Container Status:" + colors.reset);
      console.log("─".repeat(80));

      containers.forEach((container) => {
        const status =
          container.State === "running"
            ? `${colors.green}${icons.check} Running${colors.reset}`
            : `${colors.red}${icons.cross} ${container.State}${colors.reset}`;

        const ports = container.Publishers
          ? container.Publishers.map(
              (p) => `${p.PublishedPort}:${p.TargetPort}`
            ).join(", ")
          : "No ports";

        console.log(`${colors.cyan}${container.Name}${colors.reset}`);
        console.log(`  Status: ${status}`);
        console.log(`  Ports:  ${ports}`);
        console.log("");
      });

      // Show access URLs if containers are running
      const runningContainers = containers.filter((c) => c.State === "running");
      if (runningContainers.length > 0) {
        const appContainer = runningContainers.find((c) => c.Service === "app");
        const dbContainer = runningContainers.find((c) => c.Service === "db");

        console.log(colors.bright + "Access URLs:" + colors.reset);
        console.log("─".repeat(80));

        if (appContainer && appContainer.Publishers) {
          const appPort = appContainer.Publishers.find(
            (p) => p.TargetPort === 3000
          );
          if (appPort) {
            console.log(
              `${icons.web} Application: ${colors.green}http://localhost:${appPort.PublishedPort}${colors.reset}`
            );
          }
        }

        if (dbContainer && dbContainer.Publishers) {
          const dbPort = dbContainer.Publishers.find(
            (p) => p.TargetPort === 5432
          );
          if (dbPort) {
            console.log(
              `${icons.database} Database:    ${colors.green}localhost:${dbPort.PublishedPort}${colors.reset}`
            );
          }
        }
        console.log("");
      }
    } catch (error) {
      this.error(`Failed to get status: ${error.message}`);
    }
  }

  async logs() {
    try {
      await this.checkDockerCompose();
      this.log(
        `${icons.logs} Showing logs (Press Ctrl+C to exit)...`,
        colors.cyan
      );
      await this.runCommand(
        `docker compose -f ${this.dockerComposeFile} logs -f`,
        "Fetching logs"
      );
    } catch (error) {
      this.error(`Failed to show logs: ${error.message}`);
    }
  }

  async build() {
    try {
      await this.checkDockerCompose();
      this.log(`${icons.docker} Building Docker image...`, colors.magenta);
      await this.runCommand(
        `docker compose -f ${this.dockerComposeFile} build --no-cache`,
        "Building application image"
      );
      this.success("Docker image built successfully!");
    } catch (error) {
      this.error(`Failed to build: ${error.message}`);
      process.exit(1);
    }
  }

  async clean() {
    try {
      await this.checkDockerCompose();
      this.log(
        `${icons.warning} Cleaning up (this will remove volumes and data!)...`,
        colors.yellow
      );

      // Ask for confirmation
      const readline = require("readline");
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise((resolve) => {
        rl.question(
          "Are you sure you want to remove all data? (y/N): ",
          resolve
        );
      });
      rl.close();

      if (answer.toLowerCase() !== "y" && answer.toLowerCase() !== "yes") {
        this.info("Operation cancelled");
        return;
      }

      await this.runCommand(
        `docker compose -f ${this.dockerComposeFile} down -v`,
        "Removing containers and volumes"
      );
      await this.runCommand(
        "docker system prune -f",
        "Cleaning up Docker system"
      );
      this.success("Cleanup completed!");
    } catch (error) {
      this.error(`Failed to clean: ${error.message}`);
    }
  }

  async dev() {
    try {
      this.log(`${icons.rocket} Starting development server...`, colors.cyan);
      await this.runCommand(
        "bun run dev",
        "Starting Next.js development server"
      );
    } catch (error) {
      this.error(`Failed to start dev server: ${error.message}`);
    }
  }

  showHelp() {
    console.log(`
${colors.cyan}${colors.bright}Mbx Homepage CLI${colors.reset}
${colors.blue}Manage your Mbx Homepage Docker deployment with ease${colors.reset}

${colors.bright}Usage:${colors.reset}
  ./mbx <command>

${colors.bright}Commands:${colors.reset}
  ${colors.green}start${colors.reset}     ${icons.rocket} Start the production server
  ${colors.green}stop${colors.reset}      ${icons.stop} Stop the production server
  ${colors.green}restart${colors.reset}   ${icons.gear} Restart the production server
  ${colors.green}status${colors.reset}    ${icons.info} Show container status and URLs
  ${colors.green}logs${colors.reset}      ${icons.logs} Show live logs from all containers
  ${colors.green}build${colors.reset}     ${icons.docker} Build Docker images
  ${colors.green}clean${colors.reset}     ${icons.warning} Remove all containers and volumes
  ${colors.green}dev${colors.reset}       ${icons.web} Start development server
  ${colors.green}help${colors.reset}      Show this help message

${colors.bright}Examples:${colors.reset}
  ./mbx start       # Deploy and start the application
  ./mbx status      # Check if everything is running
  ./mbx logs        # Monitor application logs
  ./mbx stop        # Stop the application

${colors.bright}Files:${colors.reset}
  ${colors.yellow}docker-compose.prod.yml${colors.reset}  Production Docker Compose configuration
  ${colors.yellow}.env.production${colors.reset}         Production environment variables
  ${colors.yellow}scripts/deploy.sh${colors.reset}       Deployment script

${colors.bright}For more information:${colors.reset}
  Visit: ${colors.blue}https://github.com/MBeggiato/mbx${colors.reset}
`);
  }

  async run() {
    const command = process.argv[2];

    switch (command) {
      case "start":
        await this.start();
        break;
      case "stop":
        await this.stop();
        break;
      case "restart":
        await this.restart();
        break;
      case "status":
        await this.status();
        break;
      case "logs":
        await this.logs();
        break;
      case "build":
        await this.build();
        break;
      case "clean":
        await this.clean();
        break;
      case "dev":
        await this.dev();
        break;
      case "help":
      case "--help":
      case "-h":
        this.showHelp();
        break;
      default:
        if (command) {
          this.error(`Unknown command: ${command}`);
        }
        this.showHelp();
        process.exit(1);
    }
  }
}

// Run the CLI
const cli = new MbxCLI();
cli.run().catch((error) => {
  console.error(
    `${colors.red}${icons.cross} Unexpected error: ${error.message}${colors.reset}`
  );
  process.exit(1);
});
