#!/usr/bin/env node

/**
 * Direct CLI Shortcut for updating skill-creator
 * Usage: skill-creator-update
 */

process.argv = [process.argv[0], process.argv[1], 'update', ...process.argv.slice(2)];
require('./skill-creator.js');
