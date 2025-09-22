import { execSync } from 'child_process';
import { existsSync, rmSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const templates = ['base', 'dashboard'];

function processTemplate(templateName: string) {
  const targetPath = join(__dirname, '..', 'templates', templateName);
  const sourcePath = join(__dirname, '..', '..', 'nextadmin-intl-theme-auth', 'dist', templateName);

  // Check if source path exists
  if (!existsSync(sourcePath)) {
    console.error(`Source path does not exist: ${sourcePath}`);
    return false;
  }

  // Remove node_modules first if it exists in target
  const nodeModulesPath = join(sourcePath, 'node_modules');
  if (existsSync(nodeModulesPath)) {
    console.log(`Deleting node_modules from nextadmin-intl-theme-auth/dist/${templateName}...`);
    rmSync(nodeModulesPath, { recursive: true, force: true });
  }

  // Remove existing target folder
  if (existsSync(targetPath)) {
    console.log(`Deleting /templates/${templateName}...`);
    rmSync(targetPath, { recursive: true, force: true });
  }

  console.log(`Copying from ${sourcePath} to /templates/${templateName}...`);

  // Copy files from source to target
  try {
    execSync(`cp -r "${sourcePath}" "${targetPath}"`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error copying ${templateName}:`, error);
    return false;
  }

  console.log(`Cleaning up ${templateName} folder...`);

  // Remove unwanted files and folders
  const filesToRemove = [
    '.env',
    '.gitignore',
    '.next',
    'node_modules',
    join('prisma', 'dev.db')
  ];

  filesToRemove.forEach(file => {
    const filePath = join(targetPath, file);
    if (existsSync(filePath)) {
      rmSync(filePath, { recursive: true, force: true });
      console.log(`  Removed: ${file}`);
    }
  });

  // Rename .gitignore to gitignore if it exists
  const gitignorePath = join(targetPath, '.gitignore');
  const renamedGitignorePath = join(targetPath, 'gitignore');
  if (existsSync(gitignorePath)) {
    execSync(`mv "${gitignorePath}" "${renamedGitignorePath}"`);
    console.log('  Renamed .gitignore to gitignore');
  }

  // Update package.json
  const pkgJsonPath = join(targetPath, 'package.json');
  if (existsSync(pkgJsonPath)) {
    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
    pkgJson.version = '0.1.0';
    pkgJson.name = 'nextadmin';
    writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
    console.log('  package.json updated.');
  }

  console.log(`✅ ${templateName} template processed successfully.\n`);
  return true;
}

console.log('🚀 Starting template processing...\n');

let successCount = 0;
templates.forEach(template => {
  console.log(`📁 Processing ${template} template:`);
  if (processTemplate(template)) {
    successCount++;
  }
});

console.log(`🎉 Process complete! ${successCount}/${templates.length} templates processed successfully.`);

// Copy CHANGELOG.md to project root
const changelogSourcePath = join(__dirname, '..', '..', 'nextadmin-intl-theme-auth', 'CHANGELOG.md');
const changelogTargetPath = join(__dirname, '..', 'CHANGELOG.md');
if (existsSync(changelogSourcePath)) {
  execSync(`cp "${changelogSourcePath}" "${changelogTargetPath}"`);
  console.log('📄 CHANGELOG.md copied to project root');
}
