#!/usr/bin/env node

/**
 * Direct CLI Shortcut for validating skills or plugins
 * Usage: skill-creator-validate [path]
 */

const fs = require('fs');
const path = require('path');

const target = process.argv[2] || process.cwd();

// Auto-detect if target is a plugin or a skill
let isPlugin = false;
if (fs.existsSync(target)) {
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    if (fs.existsSync(path.join(target, 'plugin.json')) || fs.existsSync(path.join(target, 'plugins'))) {
      isPlugin = true;
    }
  } else if (target.endsWith('plugin.json')) {
    isPlugin = true;
  }
}

if (isPlugin) {
  require('./validate_plugin.js');
} else {
  require('./validate_skill.js');
}
