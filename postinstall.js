#!/usr/bin/env node

/**
 * Post-install script for ai-skill-creator
 * Automatically installs skill-creator into global Antigravity skills directory.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function getGlobalAntigravitySkillsDir() {
  const homeDir = os.homedir();
  return path.join(homeDir, '.gemini', 'config', 'skills');
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

function postInstall() {
  try {
    const cwd = process.cwd();
    // Guard against npm staging directory non-existence during global git install
    if (!fs.existsSync(cwd)) {
      return;
    }

    const globalSkillsDir = getGlobalAntigravitySkillsDir();
    const sourceSkillCreatorDir = path.join(__dirname, '.agents', 'skills', 'skill-creator');

    if (!fs.existsSync(sourceSkillCreatorDir)) {
      return;
    }

    const targetSkillCreatorDir = path.join(globalSkillsDir, 'skill-creator');

    console.log(`\n${COLORS.bright}=== Antigravity Skill Creator Auto-Installer ===${COLORS.reset}`);
    console.log(`Installing skill-creator to global Antigravity config...`);

    copyFolderRecursiveSync(sourceSkillCreatorDir, targetSkillCreatorDir);

    console.log(`${COLORS.green}[✔ PASS]${COLORS.reset} Successfully installed "skill-creator" to global path:`);
    console.log(`         ${COLORS.cyan}${targetSkillCreatorDir}${COLORS.reset}\n`);
    console.log(`Skill-creator is now active GLOBALLY across all projects on your machine!\n`);
  } catch (err) {
    // Graceful fallback - do not fail npm install
  }
}

postInstall();
