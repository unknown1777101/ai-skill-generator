#!/usr/bin/env node

/**
 * Direct CLI Shortcut for uninstalling skill-creator
 * Usage: skill-creator-uninstall
 */

process.argv = [process.argv[0], process.argv[1], 'uninstall', ...process.argv.slice(2)];
require('./skill-creator.js');
