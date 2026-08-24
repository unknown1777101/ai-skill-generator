#!/usr/bin/env node

/**
 * CLI tool for managing the skill-creator meta-skill (install, update, uninstall).
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function getGlobalAntigravitySkillsDir() {
  const homeDir = os.homedir();
  return path.join(homeDir, '.gemini', 'config', 'skills');
}

function deleteFolderRecursive(targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.readdirSync(targetPath).forEach((file) => {
      const curPath = path.join(targetPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(targetPath);
  }
}

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  for (const file of files) {
    const srcPath = path.join(source, file);
    const tgtPath = path.join(target, file);

    if (fs.statSync(srcPath).isDirectory()) {
      copyFolderRecursiveSync(srcPath, tgtPath);
    } else {
      fs.copyFileSync(srcPath, tgtPath);
    }
  }
}

function showHelp() {
  console.log(`\n${COLORS.bright}=== Antigravity Skill Creator CLI ===${COLORS.reset}`);
  console.log('Usage: skill-creator <command>\n');
  console.log('Commands:');
  console.log(`  ${COLORS.cyan}update${COLORS.reset}      Perform a clean installation/update of skill-creator to global Antigravity config`);
  console.log(`  ${COLORS.cyan}uninstall${COLORS.reset}   Uninstall and delete skill-creator from global Antigravity config\n`);
}

function run() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }

  const command = args[0].toLowerCase();
  const globalSkillsDir = getGlobalAntigravitySkillsDir();
  const targetSkillCreatorDir = path.join(globalSkillsDir, 'skill-creator');

  if (command === 'uninstall') {
    console.log(`\n${COLORS.bright}=== Uninstalling skill-creator ===${COLORS.reset}`);
    if (fs.existsSync(targetSkillCreatorDir)) {
      try {
        deleteFolderRecursive(targetSkillCreatorDir);
        console.log(`${COLORS.green}[✔ PASS]${COLORS.reset} Successfully uninstalled "skill-creator" from:`);
        console.log(`         ${COLORS.cyan}${targetSkillCreatorDir}${COLORS.reset}\n`);
      } catch (err) {
        console.error(`${COLORS.red}[✖ FAIL]${COLORS.reset} Error during uninstallation: ${err.message}`);
        process.exit(1);
      }
    } else {
      console.log(`${COLORS.yellow}[⚠ WARN]${COLORS.reset} "skill-creator" was not installed globally at:`);
      console.log(`         ${targetSkillCreatorDir}\n`);
    }
  } else if (command === 'update') {
    console.log(`\n${COLORS.bright}=== Updating skill-creator ===${COLORS.reset}`);
    
    // 1. Uninstall the old version
    if (fs.existsSync(targetSkillCreatorDir)) {
      console.log(`Removing old version...`);
      try {
        deleteFolderRecursive(targetSkillCreatorDir);
      } catch (err) {
        console.error(`${COLORS.red}[✖ FAIL]${COLORS.reset} Error removing old version: ${err.message}`);
        process.exit(1);
      }
    }

    // 2. Install the new version
    const sourceSkillCreatorDir = path.join(__dirname, '..', '.agents', 'skills', 'skill-creator');
    if (!fs.existsSync(sourceSkillCreatorDir)) {
      console.error(`${COLORS.red}[✖ FAIL]${COLORS.reset} Source skill-creator folder not found at:`);
      console.error(`         ${sourceSkillCreatorDir}`);
      process.exit(1);
    }

    console.log(`Copying new version...`);
    try {
      copyFolderRecursiveSync(sourceSkillCreatorDir, targetSkillCreatorDir);
      console.log(`${COLORS.green}[✔ PASS]${COLORS.reset} Successfully updated "skill-creator" at:`);
      console.log(`         ${COLORS.cyan}${targetSkillCreatorDir}${COLORS.reset}\n`);
    } catch (err) {
      console.error(`${COLORS.red}[✖ FAIL]${COLORS.reset} Error copying new version: ${err.message}`);
      process.exit(1);
    }
  } else {
    console.error(`${COLORS.red}[✖ FAIL]${COLORS.reset} Unknown command: "${command}"`);
    showHelp();
    process.exit(1);
  }
}

run();
