#!/usr/bin/env ts-node

import prompts from "prompts";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { execSync } from "node:child_process";
import { existsSync, renameSync, appendFileSync, cpSync } from "fs";
import fs from "fs";
import path from "path";

interface CliOptions {
  name?: string;
  package?: "npm" | "yarn" | "pnpm" | "bun";
  withTemplate?: boolean;
}

async function main() {
  console.log("🚀 Welcome to Admin Dashboard with NextJS (NextAdmin) ✨");

  const scriptDir = __dirname;
  const templatePath = path.join(scriptDir, "..", "templates", "base");

  const argv = yargs(hideBin(process.argv))
    .options({
      name: {
        type: "string",
        describe: "Name of your project (use '.' for current directory)",
        alias: "n",
      },
      package: {
        type: "string",
        describe: "Package manager to use (npm, yarn, pnpm, or bun)",
        choices: ["npm", "yarn", "pnpm", "bun"],
        alias: "p",
      },
      withTemplate: {
        type: "boolean",
        describe: "Include the dashboard template with all dependencies",
        default: false,
      },
      help: {
        alias: "h",
        type: "boolean",
        describe: "Show help",
      },
    })
    .example("$0", "Run with interactive prompts")
    .example(
      "$0 --name my-dashboard --package pnpm",
      "Skip prompts and create a project directly",
    )
    .example(
      "$0 -n . -p pnpm --withTemplate",
      "Install in current directory with template",
    )
    .example("$0 -n my-dashboard", "Only prompt for package manager")
    .help().argv as CliOptions;

  let projectName = argv.name;
  let packageManager = argv.package;
  let withTemplate = argv.withTemplate;

  const needProjectName = !projectName;
  const needPackageManager = !packageManager;

  if (needProjectName || needPackageManager) {
    const answers = await prompts(
      [
        {
          type: needProjectName ? "text" : null,
          name: "projectName",
          message:
            "What is your project named? (use '.' for current directory)",
          initial: "my-app",
          validate: (input: string) => {
            if (!input.trim()) return "The project name cannot be empty.";
            if (input.trim() === ".") return true; // Allow current directory
            if (existsSync(path.resolve(input)))
              return `A folder named "${input}" already exists. Please use a different name.`;
            return true;
          },
        },
        {
          type: needPackageManager ? "select" : null,
          name: "packageManager",
          message: "Which package manager do you want to use?",
          choices: [
            { title: "npm", value: "npm" },
            { title: "yarn", value: "yarn" },
            { title: "pnpm", value: "pnpm" },
            { title: "bun", value: "bun" },
          ],
          initial: 0, // Default to 'npm'
        },
      ],
      {
        onCancel: () => {
          console.log("\x1b[1m\x1b[31m❌ Operation cancelled.\x1b[0m");
          process.exit(0);
        },
      },
    );

    projectName = answers.projectName || projectName;
    packageManager = answers.packageManager || packageManager;
  } else {
    if (
      projectName !== "." &&
      existsSync(path.resolve(projectName as string))
    ) {
      console.error(
        `\x1b[1m\x1b[31m❌ Error: A folder named "${projectName}" already exists. Please use a different name.\x1b[0m`,
      );
      process.exit(1);
    }
  }

  if (!projectName || !packageManager) {
    console.log("\x1b[1m\x1b[31m❌ Operation cancelled.\x1b[0m");
    return;
  }

  const executors = {
    local: {
      npm: "npx",
      yarn: "yarn",
      pnpm: "pnpm",
      bun: "bun",
    },
    latest: {
      npm: "npx",
      yarn: "yarn dlx",
      pnpm: "pnpm dlx",
      bun: "bunx --bun",
    },
  };

  const isCurrentDirectory = projectName === ".";
  //const targetDirectory = isCurrentDirectory ? process.cwd() : projectName;
  const displayName = isCurrentDirectory ? "current directory" : projectName;

  try {
    console.log(`📂 Creating project in: ${displayName}...`);

    if (!existsSync(templatePath)) {
      console.error(
        `\x1b[1m\x1b[31m❌ Error: Template directory not found at ${templatePath}\x1b[0m`,
      );
      process.exit(1);
    }

    // Check if current directory is empty when using "."
    if (isCurrentDirectory) {
      const files = fs
        .readdirSync(process.cwd())
        .filter((file) => !file.startsWith(".git"));
      if (files.length > 0) {
        const { proceed } = await prompts({
          type: "confirm",
          name: "proceed",
          message: "Current directory is not empty. Continue anyway?",
          initial: false,
        });

        if (!proceed) {
          console.log("\x1b[1m\x1b[31m❌ Operation cancelled.\x1b[0m");
          return;
        }
      }
    }

    if (!isCurrentDirectory) {
      cpSync(templatePath, projectName, {
        recursive: true,
        force: false,
        preserveTimestamps: true,
      });
    } else {
      // Copy files to current directory
      const files = fs.readdirSync(templatePath);
      for (const file of files) {
        const srcPath = path.join(templatePath, file);
        const destPath = path.join(process.cwd(), file);

        if (fs.statSync(srcPath).isDirectory()) {
          cpSync(srcPath, destPath, {
            recursive: true,
            force: true,
            preserveTimestamps: true,
          });
        } else {
          cpSync(srcPath, destPath, {
            force: true,
            preserveTimestamps: true,
          });
        }
      }
    }
    console.log("✅ Template files copied successfully!");

    const destPath = isCurrentDirectory
      ? process.cwd()
      : path.join(process.cwd(), projectName);
    const gitignorePath = path.join(destPath, "gitignore");
    if (fs.existsSync(gitignorePath)) {
      fs.renameSync(gitignorePath, path.join(destPath, ".gitignore"));
    }

    if (withTemplate) {
      const dashboardTemplatePath = path.join(
        scriptDir,
        "..",
        "templates",
        "dashboard",
      );

      if (!existsSync(dashboardTemplatePath)) {
        console.error(
          `\x1b[1m\x1b[31m❌ Error: Dashboard template directory not found at ${dashboardTemplatePath}\x1b[0m`,
        );
        process.exit(1);
      }

      console.log("📦 Adding dashboard template...");
      if (!isCurrentDirectory) {
        cpSync(dashboardTemplatePath, projectName, {
          recursive: true,
          force: true,
          preserveTimestamps: true,
        });
      } else {
        // Copy dashboard template files to current directory
        const files = fs.readdirSync(dashboardTemplatePath);
        for (const file of files) {
          const srcPath = path.join(dashboardTemplatePath, file);
          const destPath = path.join(process.cwd(), file);

          if (fs.statSync(srcPath).isDirectory()) {
            cpSync(srcPath, destPath, {
              recursive: true,
              force: true,
              preserveTimestamps: true,
            });
          } else {
            cpSync(srcPath, destPath, {
              force: true,
              preserveTimestamps: true,
            });
          }
        }
      }
      console.log("✅ Dashboard template added!");
    }

    // Package.json's name
    const packageJsonPath = path.join(destPath, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      packageJson.name = isCurrentDirectory
        ? path.basename(process.cwd())
        : projectName;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }

    // Install Dependencies
    console.log(`📦 Installing dependencies with ${packageManager}...`);
    const workingDir = isCurrentDirectory ? process.cwd() : projectName;

    if (packageManager === "pnpm") {
      const allowBuilds = [
        "@prisma/client",
        "prisma",
        "sharp",
        "unrs-resolver",
      ];
      const flags = allowBuilds
        .map((pkg) => `${pkg} --allow-build=${pkg}`)
        .join(" ");
      execSync(`pnpm install ${flags}`, {
        stdio: "inherit",
        cwd: workingDir,
      });
    } else {
      execSync(`${packageManager} install`, {
        stdio: "inherit",
        cwd: workingDir,
      });
    }

    // Install shadcn components and additional dependencies when withTemplate is true
    if (withTemplate) {
      console.log(
        "🎨 Installing shadcn components and additional dependencies...",
      );

      const shadcnComponents = [
        "avatar",
        "badge",
        "chart",
        "checkbox",
        "separator",
        "sheet",
        "sidebar",
        "skeleton",
        "sonner",
        "table",
        "tabs",
        "toggle-group",
        "toggle",
        "tooltip",
      ];

      const additionalDeps = [
        "@tanstack/react-table",
        "@dnd-kit/core",
        "@dnd-kit/modifiers",
        "@dnd-kit/sortable",
        "@dnd-kit/utilities",
      ];

      // Install shadcn components

      for (const component of shadcnComponents) {
        console.log(`Installing ${component}...`);
        try {
          execSync(
            `${executors.latest[packageManager]} shadcn@latest add ${component} --yes`,
            {
              stdio: "inherit",
              cwd: workingDir,
            },
          );
        } catch (error) {
          console.warn(
            `⚠️ Warning: Failed to install shadcn component ${component}`,
          );
        }
      }

      // Install additional dependencies
      console.log("Installing additional dependencies...");
      const depsCommand =
        packageManager === "npm"
          ? "npm install"
          : packageManager === "yarn"
            ? "yarn add"
            : packageManager === "bun"
              ? "bun add"
              : "pnpm add";

      try {
        execSync(`${depsCommand} ${additionalDeps.join(" ")}`, {
          stdio: "inherit",
          cwd: workingDir,
        });
        console.log("✅ Additional dependencies installed successfully!");
      } catch (error) {
        console.warn(
          "⚠️ Warning: Some additional dependencies failed to install",
        );
      }
    }

    // Generate Auth Secret
    console.log("🔐 Generating Auth Secret...");
    execSync(`${executors.latest[packageManager]} auth secret`, {
      stdio: "inherit",
      cwd: workingDir,
    });

    const envLocalPath = path.join(destPath, ".env.local");
    const envPath = path.join(destPath, ".env");

    if (existsSync(envLocalPath)) {
      console.log("📄 Renaming .env.local to .env...");
      renameSync(envLocalPath, envPath);
    }

    // Add DATABASE_URL to .env
    const envFilePath = path.join(destPath, ".env");
    const databaseUrl = 'DATABASE_URL="file:./dev.db"';

    if (existsSync(envFilePath)) {
      console.log("📄 Adding DATABASE_URL to .env...");
      appendFileSync(envFilePath, `\n${databaseUrl}`, "utf8");
    }

    // Prisma Generate
    console.log("⚡ Running Prisma generate...");
    execSync(`${executors.local[packageManager]} prisma generate`, {
      stdio: "inherit",
      cwd: workingDir,
    });

    // Prisma DB Push
    console.log("🚀 Running Prisma push...");
    execSync(`${executors.local[packageManager]} prisma db push`, {
      stdio: "inherit",
      cwd: workingDir,
    });

    console.log("\x1b[1m\x1b[32m✅ Success!\x1b[0m");

    if (isCurrentDirectory) {
      console.log(
        `➡️  Run the command: \x1b[1m\x1b[32m${packageManager} run dev\x1b[0m`,
      );
    } else {
      console.log(
        `➡️  Now, enter your project with: \x1b[1m\x1b[32mcd ${projectName}\x1b[0m`,
      );
      console.log(
        `➡️  Run the command: \x1b[1m\x1b[32m${packageManager} run dev\x1b[0m`,
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "\x1b[1m\x1b[31m❌ There was an error during installation:",
        error.message,
        "\x1b[0m",
      );
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error("\x1b[1m\x1b[31m❌ Unexpected error:", error, "\x1b[0m");
  process.exit(1);
});
