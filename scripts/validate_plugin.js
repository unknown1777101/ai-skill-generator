#!/usr/bin/env node

/**
 * Antigravity Plugin & Skill Validator (validate_plugin.js)
 * Validates complete Antigravity Plugin Packages and their contained skills.
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function logPass(msg) {
  console.log(`${COLORS.green}[✔ PASS]${COLORS.reset} ${msg}`);
}

function logWarn(msg) {
  console.log(`${COLORS.yellow}[⚠ WARN]${COLORS.reset} ${msg}`);
}

function logFail(msg) {
  console.log(`${COLORS.red}[✖ FAIL]${COLORS.reset} ${msg}`);
}

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { error: 'Frontmatter block (delimiters --- ... ---) missing at top of file.' };
  }

  const yamlText = match[1];
  const data = {};
  const lines = yamlText.split(/\r?\n/);
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  }

  return { data, raw: yamlText, body: content.slice(match[0].length) };
}

function validateSingleSkill(skillDir) {
  const skillFilePath = path.join(skillDir, 'SKILL.md');
  const skillName = path.basename(skillDir);

  console.log(`\n  ${COLORS.bright}--> Validating Skill: ${skillName}${COLORS.reset}`);

  if (!fs.existsSync(skillFilePath)) {
    logFail(`    SKILL.md not found in ${skillDir}`);
    return { hasErrors: true, warningCount: 0 };
  }

  const content = fs.readFileSync(skillFilePath, 'utf8');
  let hasErrors = false;
  let warningCount = 0;

  // Check README.md existence and basic validity
  const readmeFilePath = path.join(skillDir, 'README.md');
  if (!fs.existsSync(readmeFilePath)) {
    logFail(`    README.md not found in ${skillDir}`);
    hasErrors = true;
  } else {
    logPass(`    Found README.md in ${skillName}`);
    const readmeContent = fs.readFileSync(readmeFilePath, 'utf8');
    if (!readmeContent.includes('#') || readmeContent.length < 20) {
      logFail('    README.md is empty or missing title header.');
      hasErrors = true;
    } else {
      logPass('    README.md structure is valid.');
    }
  }

  // Frontmatter
  const fmResult = parseFrontmatter(content);
  if (fmResult.error) {
    logFail(`    Frontmatter: ${fmResult.error}`);
    hasErrors = true;
  } else {
    const { data } = fmResult;
    if (!data.name) {
      logFail('    Frontmatter missing required field "name".');
      hasErrors = true;
    } else {
      const kebabRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
      if (!kebabRegex.test(data.name)) {
        logFail(`    Frontmatter "name" ("${data.name}") must be kebab-case.`);
        hasErrors = true;
      } else {
        logPass(`    Skill name "${data.name}" is valid kebab-case.`);
      }
    }

    if (!data.description) {
      logFail('    Frontmatter missing required field "description".');
      hasErrors = true;
    } else {
      const descLen = data.description.length;
      if (descLen < 20) {
        logFail(`    Description too short (${descLen} chars). Min 20 chars.`);
        hasErrors = true;
      } else if (descLen > 350) {
        logWarn(`    Description lengthy (${descLen} chars). Recommended < 300 chars.`);
        warningCount++;
      } else {
        logPass(`    Description length (${descLen} chars) well budgeted.`);
      }

      const negativeTriggerRegex = /(do not|don't|jangan|tidak|avoid|never|only|khusus|hanya)/i;
      if (!negativeTriggerRegex.test(data.description)) {
        logWarn('    Description lacks negative triggers (e.g. "DO NOT trigger for...", "Khusus...").');
        warningCount++;
      } else {
        logPass('    Description contains negative trigger constraints.');
      }
    }
  }

  // Line count
  const lines = content.split(/\r?\n/);
  const lineCount = lines.length;
  if (lineCount > 500) {
    logFail(`    SKILL.md (${lineCount} lines) exceeds hard limit of 500 lines.`);
    hasErrors = true;
  } else if (lineCount > 300) {
    logWarn(`    SKILL.md (${lineCount} lines) > 300 lines. Consider offloading to references/.`);
    warningCount++;
  } else {
    logPass(`    Line count (${lineCount} lines) within optimal limits.`);
  }

  // Section headers
  const sectionChecks = [
    { name: 'Purpose & Scope', regex: /#+.*?(purpose|scope|tujuan)/i },
    { name: 'Strict Guardrails', regex: /#+.*?(strict\s*guardrails|guardrails|batasan|rules|prohibited|dilarang)/i },
    { name: 'Execution Workflow', regex: /#+.*?(workflow|execution\s*workflow|alur\s*kerja|steps|tahapan)/i },
    { name: 'Verification Checklist', regex: /#+.*?(verification\s*checklist|checklist|kriteria\s*verifikasi|verification)/i }
  ];

  for (const check of sectionChecks) {
    if (check.regex.test(content)) {
      logPass(`    Found header: "${check.name}"`);
    } else {
      logFail(`    Missing header: "${check.name}"`);
      hasErrors = true;
    }
  }

  return { hasErrors, warningCount };
}

function validatePlugin(targetPath) {
  console.log(`\n${COLORS.bright}=== Antigravity Plugin Validator ===${COLORS.reset}`);
  console.log(`Target Plugin: ${targetPath}\n`);

  if (!fs.existsSync(targetPath)) {
    logFail(`Path does not exist: ${targetPath}`);
    process.exit(1);
  }

  let isPluginDir = false;
  let totalErrors = 0;
  let totalWarnings = 0;

  // Check for manifest: plugin.json or skills.json
  const manifestPath = fs.existsSync(path.join(targetPath, 'plugin.json'))
    ? path.join(targetPath, 'plugin.json')
    : fs.existsSync(path.join(targetPath, 'skills.json'))
      ? path.join(targetPath, 'skills.json')
      : null;

  if (manifestPath) {
    logPass(`Found plugin manifest: ${path.basename(manifestPath)}`);
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (!manifest.name) {
        logWarn('Plugin manifest missing "name" field.');
        totalWarnings++;
      } else {
        logPass(`Plugin name: "${manifest.name}"`);
      }
    } catch (e) {
      logFail(`Invalid JSON syntax in manifest ${manifestPath}: ${e.message}`);
      totalErrors++;
    }
    isPluginDir = true;
  } else {
    logWarn('No plugin manifest (plugin.json or skills.json) found at plugin root.');
    totalWarnings++;
  }

  // Check README.md
  if (fs.existsSync(path.join(targetPath, 'README.md'))) {
    logPass('Found plugin README.md documentation.');
  } else {
    logWarn('Missing README.md in plugin root.');
    totalWarnings++;
  }

  // Check skills/ directory
  const skillsRootDir = path.join(targetPath, 'skills');
  let skillDirs = [];

  if (fs.existsSync(skillsRootDir) && fs.statSync(skillsRootDir).isDirectory()) {
    const entries = fs.readdirSync(skillsRootDir);
    for (const entry of entries) {
      const fullPath = path.join(skillsRootDir, entry);
      if (fs.statSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, 'SKILL.md'))) {
        skillDirs.push(fullPath);
      }
    }
  } else if (fs.existsSync(path.join(targetPath, 'SKILL.md'))) {
    // Target is a single skill directory rather than a full plugin package
    skillDirs.push(targetPath);
  }

  if (skillDirs.length === 0) {
    logFail('No valid skills found in plugin package! Expected skills under skills/<skill-name>/SKILL.md');
    totalErrors++;
  } else {
    logPass(`Found ${skillDirs.length} skill(s) inside plugin package.`);
    for (const skillDir of skillDirs) {
      const result = validateSingleSkill(skillDir);
      if (result.hasErrors) totalErrors++;
      totalWarnings += result.warningCount;
    }
  }

  console.log(`\n${COLORS.bright}--- Plugin Validation Summary ---${COLORS.reset}`);
  if (totalErrors > 0) {
    logFail(`Plugin validation FAILED with ${totalErrors} error(s) and ${totalWarnings} warning(s).`);
    process.exit(1);
  } else if (totalWarnings > 0) {
    logWarn(`Plugin validation PASSED with ${totalWarnings} warning(s).`);
    process.exit(0);
  } else {
    logPass(`Plugin validation PASSED 100%! All skills & manifest strictly compliant.`);
    process.exit(0);
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node validate_plugin.js <path-to-plugin-directory>');
  process.exit(1);
}

validatePlugin(args[0]);
