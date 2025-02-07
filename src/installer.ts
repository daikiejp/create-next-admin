#!/usr/bin/env ts-node

import prompts from 'prompts';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { execSync } from 'node:child_process';
import { existsSync, renameSync, appendFileSync } from 'fs';
import path from 'path';

interface CliOptions {
  name?: string;
  package?: 'npm' | 'yarn' | 'pnpm' | 'bun';
}

async function main() {
  console.log('🚀 Welcome to Admin Dashboard with NextJS (NextAdmin) ✨');

  const argv = yargs(hideBin(process.argv))
    .options({
      'name': {
        type: 'string',
        describe: 'Name of your project',
        alias: 'n',
      },
      'package': {
        type: 'string',
        describe: 'Package manager to use (npm, yarn, pnpm, or bun)',
        choices: ['npm', 'yarn', 'pnpm', 'bun'],
        alias: 'p',
      },
      'help': {
        alias: 'h',
        type: 'boolean',
        describe: 'Show help',
      },
    })
    .example('$0', 'Run with interactive prompts')
    .example('$0 --name my-dashboard --package pnpm', 'Skip prompts and create a project directly')
    .example('$0 -n my-dashboard -p pnpm', 'Skip prompts with shorthand options')
    .example('$0 -n my-dashboard', 'Only prompt for package manager')
    .help()
    .argv as CliOptions;

  let projectName = argv.name;
  let packageManager = argv.package;

  const needProjectName = !projectName;
  const needPackageManager = !packageManager;
  
  if (needProjectName || needPackageManager) {
    const answers = await prompts([
      {
        type: needProjectName ? 'text' : null,
        name: 'projectName',
        message: 'What is your project named?',
        initial: 'my-app',
        validate: (input: string) => {
          if (!input.trim()) return 'The project name cannot be empty.';
          if (existsSync(path.resolve(input)))
            return `A folder named "${input}" already exists. Please use a different name.`;
          return true;
        },
      },
      {
        type: needPackageManager ? 'select' : null,
        name: 'packageManager',
        message: 'Which package manager do you want to use?',
        choices: [
          { title: 'npm', value: 'npm' },
          { title: 'yarn', value: 'yarn' },
          { title: 'pnpm', value: 'pnpm' },
          { title: 'bun', value: 'bun' },
        ],
        initial: 0, // Default to 'npm'
      },
    ], {
      onCancel: () => {
        console.log('\x1b[1m\x1b[31m❌ Operation cancelled.\x1b[0m');
        process.exit(0);
      }
    });

    projectName = answers.projectName || projectName;
    packageManager = answers.packageManager || packageManager;
  } else {
    if (existsSync(path.resolve(projectName as string))) {
      console.error(`\x1b[1m\x1b[31m❌ Error: A folder named "${projectName}" already exists. Please use a different name.\x1b[0m`);
      process.exit(1);
    }
  }

  if (!projectName || !packageManager) {
    console.log('\x1b[1m\x1b[31m❌ Operation cancelled.\x1b[0m');
    return;
  }

  const executors = {
    npm: 'npx',
    yarn: 'yarn dlx',
    pnpm: 'pnpm dlx',
    bun: 'bunx',
  };

  try {
    console.log(`📂 Creating project: ${projectName}...`);
    // Next Admin Dashboard Repo
    const repoUrl = 'https://github.com/daikiejp/nextadmin-intl-theme-auth';
    execSync(`git clone --depth 1 ${repoUrl} ${projectName}`, {
      stdio: 'inherit',
    });

    // Install Dependencies
    console.log(`📦 Installing dependencies with ${packageManager}...`);
    execSync(`${packageManager} install`, {
      stdio: 'inherit',
      cwd: projectName,
    });

    // Generate Auth Secret
    console.log('🔐 Generating Auth Secret...');
    execSync(`${executors[packageManager]} auth secret`, {
      stdio: 'inherit',
      cwd: projectName,
    });

    const envLocalPath = path.join(projectName, '.env.local');
    const envPath = path.join(projectName, '.env');

    if (existsSync(envLocalPath)) {
      console.log('🔄 Renaming .env.local to .env...');
      renameSync(envLocalPath, envPath);
    }

    // Add DATABASE_URL to .env
    const envFilePath = path.join(projectName, '.env');
    const databaseUrl = 'DATABASE_URL="file:./dev.db"';

    if (existsSync(envFilePath)) {
      console.log('🔄 Adding DATABASE_URL to .env...');
      appendFileSync(envFilePath, `\n${databaseUrl}`, 'utf8');
    }

    // Prisma Generate
    console.log('⚡ Running Prisma generate...');
    execSync(`${executors[packageManager]} prisma generate`, {
      stdio: 'inherit',
      cwd: projectName,
    });

    // Prisma DB Push
    console.log('🚀 Running Prisma push...');
    execSync(`${executors[packageManager]} prisma db push`, {
      stdio: 'inherit',
      cwd: projectName,
    });

    console.log('\x1b[1m\x1b[32m✅ Success!\x1b[0m');
    console.log(
      `➡️  Now, enter your project with: \x1b[1m\x1b[32mcd ${projectName}\x1b[0m`
    );
    console.log(
      `➡️  Run the command: \x1b[1m\x1b[32m${packageManager} run dev\x1b[0m`
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        '\x1b[1m\x1b[31m❌ There was an error during installation:',
        error.message,
        '\x1b[0m'
      );
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error('\x1b[1m\x1b[31m❌ Unexpected error:', error, '\x1b[0m');
  process.exit(1);
});
