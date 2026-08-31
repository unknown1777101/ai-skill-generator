#!/usr/bin/env node

/**
 * CLI tool for managing the skill-creator meta-skill (install, update, uninstall, validate).
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
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function getGlobalAntigravitySkillsDir() {
  const homeDir = os.homedir();
  return path.join(homeDir, '.gemini', 'config', 'skills');
}

function removeFolderSync(targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
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
  console.log('Usage: skill-creator <command> [options]\n');
  console.log('Commands:');
  console.log(`  ${COLORS.cyan}update / install${COLORS.reset}       Cleanly uninstalls the old version, then deploys the latest version to global config`);
  console.log(`  ${COLORS.cyan}uninstall${COLORS.reset}              Uninstall and delete skill-creator from global Antigravity config`);
  console.log(`  ${COLORS.cyan}validate <path>${COLORS.reset}        Validate a skill directory (SKILL.md) or full plugin package`);
  console.log(`  ${COLORS.cyan}validate-plugin <path>${COLORS.reset} Validate an Antigravity plugin package against plugin.json spec\n`);
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
        removeFolderSync(targetSkillCreatorDir);
        console.log(`${COLORS.green}[✔ UNINSTALLED]${COLORS.reset} Successfully removed "skill-creator" from:`);
        console.log(`                ${COLORS.cyan}${targetSkillCreatorDir}${COLORS.reset}\n`);
      } catch (err) {
        console.error(`${COLORS.red}[✖ FAIL]${COLORS.reset} Error during uninstallation: ${err.message}`);
        process.exit(1);
      }
    } else {
      console.log(`${COLORS.yellow}[⚠ INFO]${COLORS.reset} "skill-creator" is not currently installed at:`);
      console.log(`         ${targetSkillCreatorDir}\n`);
    }
  } else if (command === 'update' || command === 'install') {
    console.log(`\n${COLORS.bright}=== Clean Updating skill-creator ===${COLORS.reset}`);
    
    // Step 1: Explicitly uninstall/clean the previous version if it exists
    if (fs.existsSync(targetSkillCreatorDir)) {
      console.log(`${COLORS.gray}[1/2] Uninstalling existing version from global config...${COLORS.reset}`);
      try {
        removeFolderSync(targetSkillCreatorDir);
        console.log(`      ${COLORS.green}[✔ CLEANED]${COLORS.reset} Old version deleted.`);
      } catch (err) {
        console.error(`${COLORS.red}[✖ FAIL]${COLORS.reset} Error cleaning old version: ${err.message}`);
        process.exit(1);
      }
    } else {
      console.log(`${COLORS.gray}[1/2] No existing installation found. Proceeding with fresh install...${COLORS.reset}`);
    }

    // Step 2: Install fresh version from source
    const sourceSkillCreatorDir = path.join(__dirname, '..', '.agents', 'skills', 'skill-creator');
    if (!fs.existsSync(sourceSkillCreatorDir)) {
      console.error(`${COLORS.red}[✖ FAIL]${COLORS.reset} Source skill-creator folder not found at:`);
      console.error(`         ${sourceSkillCreatorDir}`);
      process.exit(1);
    }

    console.log(`${COLORS.gray}[2/2] Installing fresh version to: ${COLORS.cyan}${targetSkillCreatorDir}${COLORS.reset}`);
    try {
      copyFolderRecursiveSync(sourceSkillCreatorDir, targetSkillCreatorDir);
      console.log(`      ${COLORS.green}[✔ INSTALLED]${COLORS.reset} Successfully deployed latest "skill-creator".\n`);
    } catch (err) {
      console.error(`${COLORS.red}[✖ FAIL]${COLORS.reset} Error copying new version: ${err.message}`);
      process.exit(1);
    }
  } else if (command === 'validate' || command === 'validate-skill') {
    process.argv = [process.argv[0], process.argv[1], ...args.slice(1)];
    require('./validate_skill.js');
  } else if (command === 'validate-plugin') {
    process.argv = [process.argv[0], process.argv[1], ...args.slice(1)];
    require('./validate_plugin.js');
  } else {
    console.error(`${COLORS.red}[✖ FAIL]${COLORS.reset} Unknown command: "${command}"`);
    showHelp();
    process.exit(1);
  }
}

run();
