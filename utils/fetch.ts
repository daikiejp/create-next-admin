import { execSync } from 'child_process';
import { existsSync, rmSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const branch = process.argv[2];

if (!branch) {
  console.error('Please provide a branch name as the first argument.');
  process.exit(1);
}

const isWithTemplate = branch.includes('-with-template');
const targetFolder = isWithTemplate ? 'dashboard' : 'base';
const targetPath = join(__dirname, '..', 'templates', targetFolder);

if (existsSync(targetPath)) {
  console.log(`Deleting /templates/${targetFolder}...`);
  rmSync(targetPath, { recursive: true, force: true });
}

console.log(`Cloning branch ${branch} into /templates/${targetFolder}...`);
execSync(
  `git clone -b ${branch} https://github.com/daikiejp/nextadmin-intl-theme-auth ${targetPath}`,
  { stdio: 'inherit' }
);

console.log('Cleaning up cloned folder...');

const gitPath = join(targetPath, '.git');
if (existsSync(gitPath)) rmSync(gitPath, { recursive: true, force: true });

const envPath = join(targetPath, '.env');
if (existsSync(envPath)) rmSync(envPath);

const dbPath = join(targetPath, 'prisma', 'dev.db');
if (existsSync(dbPath)) rmSync(dbPath);

const generatedPath = join(targetPath, 'prisma', 'generated');
if (existsSync(generatedPath)) rmSync(generatedPath, { recursive: true, force: true });

const nodeModulesPath = join(targetPath, 'node_modules');
if (existsSync(nodeModulesPath)) rmSync(nodeModulesPath, { recursive: true, force: true });

const pkgJsonPath = join(targetPath, 'package.json');
if (existsSync(pkgJsonPath)) {
  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
  pkgJson.version = '0.1.0';
  pkgJson.name = 'nextadmin';
  writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
  console.log('package.json updated.');
}

console.log('Process complete.');
