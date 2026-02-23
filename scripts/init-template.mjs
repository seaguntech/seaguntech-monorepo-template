#!/usr/bin/env node

import {
  access,
  mkdir,
  readFile,
  readdir,
  stat,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, '..');
const SENTINEL_PATH = path.join(ROOT_DIR, '.template', 'initialized.json');

const EXCLUDED_DIRS = new Set([
  '.git',
  'node_modules',
  '.next',
  '.turbo',
  'dist',
  'build',
  'coverage',
  '.pnpm-store',
  '.agents',
  '.opencode',
  '.claude',
  '.cursor',
]);

const EXCLUDED_FILES = new Set(['pnpm-lock.yaml']);

const EXCLUDED_RELATIVE_FILES = new Set([
  'scripts/init-template.mjs',
  '.template/initialized.json',
]);

const TEXT_EXTENSIONS = new Set([
  '.json',
  '.md',
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.cjs',
  '.yml',
  '.yaml',
  '.css',
  '.txt',
]);

function parseArgs(argv) {
  const options = {
    dryRun: false,
    yes: false,
    force: false,
    projectName: undefined,
    scope: undefined,
    owner: undefined,
    repo: undefined,
    email: undefined,
    displayName: undefined,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--') {
      continue;
    }
    if (value === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (value === '--yes') {
      options.yes = true;
      continue;
    }
    if (value === '--force') {
      options.force = true;
      continue;
    }

    const [flag, inline] = value.split('=');
    const nextValue = inline ?? argv[index + 1];

    const assignOption = (key) => {
      if (nextValue == null || nextValue.startsWith('--')) {
        throw new Error(`Missing value for ${flag}`);
      }
      options[key] = nextValue;
      if (inline == null) {
        index += 1;
      }
    };

    if (flag === '--project-name') {
      assignOption('projectName');
      continue;
    }
    if (flag === '--scope') {
      assignOption('scope');
      continue;
    }
    if (flag === '--owner') {
      assignOption('owner');
      continue;
    }
    if (flag === '--repo') {
      assignOption('repo');
      continue;
    }
    if (flag === '--email') {
      assignOption('email');
      continue;
    }
    if (flag === '--display-name') {
      assignOption('displayName');
      continue;
    }

    throw new Error(`Unknown flag: ${value}`);
  }

  return options;
}

function toDisplayName(projectName) {
  return projectName
    .split(/[-_.\s]+/)
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join(' ');
}

function normalizeScope(scope) {
  return scope.replace(/^@/, '').trim();
}

function isValidProjectName(projectName) {
  return /^[a-z0-9][a-z0-9._-]*$/.test(projectName);
}

function isValidScope(scope) {
  return /^[a-z0-9][a-z0-9._-]*$/.test(scope);
}

function isValidGitHubPart(value) {
  return /^[A-Za-z0-9_.-]+$/.test(value);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  const rawContent = await readFile(filePath, 'utf8');
  return JSON.parse(rawContent);
}

function parseGitHubSlug(value) {
  const match = value.match(
    /github\.com[/:]([^/]+)\/([^/.]+?)(?:\.git)?(?:$|\/)/i,
  );
  if (!match) {
    return { owner: 'seaguntech', repo: 'seaguntech-monorepo-template' };
  }

  return { owner: match[1], repo: match[2] };
}

async function detectCurrentConfig() {
  const rootPackagePath = path.join(ROOT_DIR, 'package.json');
  const rootPackageJson = await readJson(rootPackagePath);
  const rootName = rootPackageJson.name;

  const repositoryUrl =
    rootPackageJson.repository?.url ??
    rootPackageJson.homepage ??
    rootPackageJson.bugs?.url ??
    '';
  const github = parseGitHubSlug(repositoryUrl);

  const packageNames = [];
  for (const folder of ['apps', 'packages', 'configs']) {
    const folderPath = path.join(ROOT_DIR, folder);
    const entries = await readdir(folderPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }
      const packageJsonPath = path.join(folderPath, entry.name, 'package.json');
      if (!(await pathExists(packageJsonPath))) {
        continue;
      }
      const packageJson = await readJson(packageJsonPath);
      if (typeof packageJson.name === 'string') {
        packageNames.push(packageJson.name);
      }
    }
  }

  const scopeCount = new Map();
  for (const name of packageNames) {
    if (!name.startsWith('@')) {
      continue;
    }
    const slashIndex = name.indexOf('/');
    if (slashIndex <= 1) {
      continue;
    }
    const scope = name.slice(1, slashIndex);
    scopeCount.set(scope, (scopeCount.get(scope) ?? 0) + 1);
  }

  let scope = 'seaguntech';
  let highestCount = 0;
  for (const [candidateScope, count] of scopeCount.entries()) {
    if (count > highestCount) {
      highestCount = count;
      scope = candidateScope;
    }
  }

  let maintainerEmail = 'oss@example.com';
  const securityPath = path.join(ROOT_DIR, 'SECURITY.md');
  if (await pathExists(securityPath)) {
    const securityContent = await readFile(securityPath, 'utf8');
    const emailMatch = securityContent.match(
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
    );
    if (emailMatch) {
      maintainerEmail = emailMatch[0];
    }
  }

  return {
    rootName,
    scope,
    owner: github.owner,
    repo: github.repo,
    maintainerEmail,
  };
}

async function promptForMissingValues(options, defaults) {
  const isInteractive = process.stdin.isTTY && !options.yes;

  if (!isInteractive) {
    return {
      projectName: options.projectName ?? defaults.rootName,
      scope: normalizeScope(options.scope ?? defaults.scope),
      owner: options.owner ?? defaults.owner,
      repo: options.repo ?? options.projectName ?? defaults.repo,
      email: options.email ?? defaults.maintainerEmail,
      displayName:
        options.displayName ??
        toDisplayName(options.projectName ?? defaults.rootName),
    };
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = async (label, defaultValue) => {
    const answer = await rl.question(`${label} (${defaultValue}): `);
    return answer.trim() || defaultValue;
  };

  try {
    const projectName = await ask(
      'Project package name',
      options.projectName ?? defaults.rootName,
    );
    const scope = normalizeScope(
      await ask('NPM scope (without @)', options.scope ?? defaults.scope),
    );
    const owner = await ask('GitHub owner', options.owner ?? defaults.owner);
    const repo = await ask('GitHub repository', options.repo ?? projectName);
    const email = await ask(
      'Maintainer contact email',
      options.email ?? defaults.maintainerEmail,
    );
    const displayName = await ask(
      'Display name',
      options.displayName ?? toDisplayName(projectName),
    );

    return { projectName, scope, owner, repo, email, displayName };
  } finally {
    rl.close();
  }
}

function validateInputs(inputs) {
  if (!isValidProjectName(inputs.projectName)) {
    throw new Error(
      `Invalid project name "${inputs.projectName}". Use lowercase npm-style names.`,
    );
  }

  if (!isValidScope(inputs.scope)) {
    throw new Error(
      `Invalid scope "${inputs.scope}". Use lowercase npm scope without @.`,
    );
  }

  if (!isValidGitHubPart(inputs.owner)) {
    throw new Error(`Invalid GitHub owner "${inputs.owner}".`);
  }

  if (!isValidGitHubPart(inputs.repo)) {
    throw new Error(`Invalid GitHub repository "${inputs.repo}".`);
  }

  if (!isValidEmail(inputs.email)) {
    throw new Error(`Invalid email address "${inputs.email}".`);
  }
}

async function collectTargetFiles(directoryPath, output = []) {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name);
    const relativePath = path.relative(ROOT_DIR, entryPath);

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) {
        continue;
      }
      if (relativePath === '.husky/_') {
        continue;
      }
      await collectTargetFiles(entryPath, output);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (EXCLUDED_FILES.has(entry.name)) {
      continue;
    }

    const extension = path.extname(entry.name);
    if (!TEXT_EXTENSIONS.has(extension) && entry.name !== 'package.json') {
      continue;
    }

    if (EXCLUDED_RELATIVE_FILES.has(relativePath)) {
      continue;
    }

    output.push(entryPath);
  }

  return output;
}

function createReplacer(currentConfig, newConfig) {
  const oldScopeToken = `@${currentConfig.scope}/`;
  const newScopeToken = `@${newConfig.scope}/`;
  const oldRepoHttp = `https://github.com/${currentConfig.owner}/${currentConfig.repo}`;
  const oldRepoGit = `${oldRepoHttp}.git`;
  const newRepoHttp = `https://github.com/${newConfig.owner}/${newConfig.repo}`;
  const newRepoGit = `${newRepoHttp}.git`;

  const oldSlugPattern = new RegExp(
    escapeRegExp(`${currentConfig.owner}/${currentConfig.repo}`),
    'g',
  );
  const oldRootNamePattern = new RegExp(
    escapeRegExp(currentConfig.rootName),
    'g',
  );
  const oldEmailPattern = new RegExp(
    escapeRegExp(currentConfig.maintainerEmail),
    'g',
  );

  const phraseReplacements = [
    {
      from: 'Seaguntech Monorepo Template',
      to: newConfig.displayName,
    },
    {
      from: 'Seaguntech Monorepo Starter',
      to: `${newConfig.displayName} Starter`,
    },
    {
      from: 'Seaguntech monorepo',
      to: `${newConfig.displayName} monorepo`,
    },
    {
      from: 'This Seaguntech monorepo template provides',
      to: `This ${newConfig.displayName} template provides`,
    },
  ];

  return (content) => {
    let nextContent = content;

    nextContent = nextContent.replaceAll(oldScopeToken, newScopeToken);
    nextContent = nextContent.replaceAll(oldRepoGit, newRepoGit);
    nextContent = nextContent.replaceAll(oldRepoHttp, newRepoHttp);
    nextContent = nextContent.replace(
      oldSlugPattern,
      `${newConfig.owner}/${newConfig.repo}`,
    );
    nextContent = nextContent.replace(
      oldRootNamePattern,
      newConfig.projectName,
    );
    nextContent = nextContent.replace(oldEmailPattern, newConfig.email);

    for (const replacement of phraseReplacements) {
      nextContent = nextContent.replaceAll(replacement.from, replacement.to);
    }

    return nextContent;
  };
}

function relative(filePath) {
  return path.relative(ROOT_DIR, filePath);
}

async function applyReplacements(options, currentConfig, newConfig) {
  const files = await collectTargetFiles(ROOT_DIR);
  const replaceContent = createReplacer(currentConfig, newConfig);
  const changedFiles = [];

  for (const filePath of files) {
    const fileInfo = await stat(filePath);
    if (fileInfo.size > 1024 * 1024) {
      continue;
    }

    const originalContent = await readFile(filePath, 'utf8');
    const nextContent = replaceContent(originalContent);

    if (nextContent === originalContent) {
      continue;
    }

    changedFiles.push(filePath);
    if (!options.dryRun) {
      await writeFile(filePath, nextContent, 'utf8');
    }
  }

  return changedFiles;
}

async function writeSentinel(newConfig) {
  await mkdir(path.dirname(SENTINEL_PATH), { recursive: true });

  const payload = {
    initializedAt: new Date().toISOString(),
    projectName: newConfig.projectName,
    scope: newConfig.scope,
    github: {
      owner: newConfig.owner,
      repo: newConfig.repo,
    },
    maintainerEmail: newConfig.email,
    displayName: newConfig.displayName,
  };

  await writeFile(
    `${SENTINEL_PATH}`,
    `${JSON.stringify(payload, null, 2)}\n`,
    'utf8',
  );
}

function printSummary(changedFiles, options, config) {
  const modeLabel = options.dryRun ? 'DRY RUN' : 'APPLIED';
  console.log(`\n[${modeLabel}] Updated ${changedFiles.length} file(s).`);
  for (const changedFile of changedFiles.slice(0, 80)) {
    console.log(`- ${relative(changedFile)}`);
  }
  if (changedFiles.length > 80) {
    console.log(`- ... and ${changedFiles.length - 80} more file(s)`);
  }

  console.log('\nConfiguration:');
  console.log(`- projectName: ${config.projectName}`);
  console.log(`- scope: @${config.scope}`);
  console.log(`- github: ${config.owner}/${config.repo}`);
  console.log(`- email: ${config.email}`);
  console.log(`- displayName: ${config.displayName}`);

  if (options.dryRun) {
    console.log(
      '\nNo files were written. Re-run without --dry-run to apply changes.',
    );
  } else {
    console.log('\nNext steps:');
    console.log('1. pnpm install');
    console.log('2. pnpm lint && pnpm check-types && pnpm build');
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const currentConfig = await detectCurrentConfig();

  const sentinelExists = await pathExists(SENTINEL_PATH);
  if (sentinelExists && !options.force && !options.dryRun) {
    throw new Error(
      '.template/initialized.json already exists. Use --force to run again.',
    );
  }

  const userConfig = await promptForMissingValues(options, currentConfig);
  validateInputs(userConfig);

  const changedFiles = await applyReplacements(
    options,
    currentConfig,
    userConfig,
  );

  if (!options.dryRun) {
    await writeSentinel(userConfig);
    changedFiles.push(SENTINEL_PATH);
  }

  printSummary(changedFiles, options, userConfig);
}

main().catch((error) => {
  console.error(`\nTemplate init failed: ${error.message}`);
  process.exitCode = 1;
});
