#!/usr/bin/env ts-node

import prompts from 'prompts';
import { execSync } from 'node:child_process';
import { existsSync } from 'fs';
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

  const { projectName, packageManager } = answers;

  if (!projectName || !packageManager) {
    console.log('\x1b[1m\x1b[31m❌ Operation cancelled.\x1b[0m');
    return;
  }

  // Commands
  let command = `npx create-next-app@latest ${projectName} `;
  if (packageManager === 'npm') {
    command += '--use-npm ';
  } else if (packageManager === 'yarn') {
    command += '--use-yarn ';
  } else if (packageManager === 'pnpm') {
    command += '--use-pnpm ';
  } else if (packageManager === 'bun') {
    command += '--use-bun ';
  }
  command += '--typescript ';
  command += '--eslint ';
  command += '--tailwind ';
  command += '--no-src-dir ';
  command += '--app ';
  command += '--turbopack ';
  command += '--import-alias "@/*" ';

  try {
    console.log('📂 Creating the project...');
    execSync(command, { stdio: 'inherit' });

    console.log(`📦 Installing dependencies with ${packageManager}...`);
    execSync(`${packageManager} install`, {
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
