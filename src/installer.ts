#!/usr/bin/env ts-node

import prompts from 'prompts';
import { execSync } from 'node:child_process';
import { existsSync, renameSync, appendFileSync } from 'fs';
import path from 'path';

async function main() {
  console.log('🚀 Welcome to Admin Dashboard with NextJS (Nextadmin) ✨');

  // Questions
  const answers = await prompts([
    {
      type: 'text',
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
      type: 'select',
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
  ]);

  const {
    projectName,
    packageManager,
  }: { projectName: string; packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun' } =
    answers;

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
    console.log('📂 Creating the project...');
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
    }
  }
}

main();
