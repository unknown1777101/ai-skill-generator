#!/usr/bin/env node

/**
 * Antigravity Skill Validator (validate_skill.js)
 * Validates Antigravity SKILL.md files against quality, triggering, and context-safety standards.
 */

const fs = require('fs');
const path = require('path');

// Colors for terminal output
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

function logInfo(msg) {
  console.log(`${COLORS.cyan}[i INFO]${COLORS.reset} ${msg}`);
}

// Parse YAML frontmatter simply without external npm dependencies
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
      // Strip outer quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  }

  return { data, raw: yamlText, body: content.slice(match[0].length) };
}

function validateSkill(targetPath) {
  console.log(`\n${COLORS.bright}=== Antigravity Skill Validator ===${COLORS.reset}`);
  console.log(`Target: ${targetPath}\n`);

  let skillFilePath = targetPath;
  let skillDir = targetPath;

  if (fs.existsSync(targetPath)) {
    const stat = fs.statSync(targetPath);
    if (stat.isDirectory()) {
      skillFilePath = path.join(targetPath, 'SKILL.md');
      skillDir = targetPath;
    } else {
      skillDir = path.dirname(targetPath);
    }
  } else {
    logFail(`Path does not exist: ${targetPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(skillFilePath)) {
    logFail(`SKILL.md file not found at: ${skillFilePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(skillFilePath, 'utf8');
  let hasErrors = false;
  let warningCount = 0;

  // Check README.md existence and basic validity
  const readmeFilePath = path.join(skillDir, 'README.md');
  if (!fs.existsSync(readmeFilePath)) {
    logFail(`README.md file not found at: ${readmeFilePath}`);
    hasErrors = true;
  } else {
    logPass('Found README.md in skill directory.');
    const readmeContent = fs.readFileSync(readmeFilePath, 'utf8');
    if (!readmeContent.includes('#') || readmeContent.length < 20) {
      logFail('README.md is empty or missing title header.');
      hasErrors = true;
    } else {
      logPass('README.md structure is valid.');
    }
  }

  // 1. Frontmatter Validation
  const fmResult = parseFrontmatter(content);
  if (fmResult.error) {
    logFail(`Frontmatter check: ${fmResult.error}`);
    hasErrors = true;
  } else {
    logPass('YAML Frontmatter syntax is valid.');
    const { data } = fmResult;

    // Name Check
    if (!data.name) {
      logFail('Frontmatter missing required field "name".');
      hasErrors = true;
    } else {
      const kebabRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
      if (!kebabRegex.test(data.name)) {
        logFail(`Frontmatter "name" ("${data.name}") must be kebab-case (lowercase letters, numbers, hyphens).`);
        hasErrors = true;
      } else {
        logPass(`Skill name "${data.name}" is valid kebab-case.`);
      }
    }

    // Description Check
    if (!data.description) {
      logFail('Frontmatter missing required field "description".');
      hasErrors = true;
    } else {
      const descLen = data.description.length;
      if (descLen < 20) {
        logFail(`Description is too short (${descLen} chars). Must be at least 20 chars to provide clear trigger context.`);
        hasErrors = true;
      } else if (descLen > 350) {
        logWarn(`Description is lengthy (${descLen} chars). Keep under 300 chars to optimize context window.`);
        warningCount++;
      } else {
        logPass(`Description length (${descLen} chars) is well-budgeted.`);
      }

      // Negative constraint / trigger condition check
      const negativeTriggerRegex = /(do not|don't|jangan|tidak|avoid|never|only|khusus|hanya)/i;
      if (!negativeTriggerRegex.test(data.description)) {
        logWarn('Description lacks negative triggering constraints (e.g. "DO NOT trigger for...", "Khusus untuk..."). Adding negative triggers prevents false activations.');
        warningCount++;
      } else {
        logPass('Description includes explicit trigger boundaries/negative constraints.');
      }
    }

    // Category Check (Optional / Recommended metadata)
    if (data.category) {
      logPass(`Found category metadata: "${data.category}".`);
    } else {
      logInfo('No explicit "category" field in frontmatter (Optional but recommended for multi-domain catalogs).');
    }
  }

  // 2. Line Count & Context Budgeting Check
  const lines = content.split(/\r?\n/);
  const lineCount = lines.length;

  if (lineCount > 500) {
    logFail(`SKILL.md line count (${lineCount} lines) exceeds the hard limit of 500 lines. Split details into references/ folder.`);
    hasErrors = true;
  } else if (lineCount > 300) {
    logWarn(`SKILL.md line count (${lineCount} lines) exceeds recommended 300 lines. Consider offloading docs to references/ folder.`);
    warningCount++;
  } else {
    logPass(`SKILL.md line count (${lineCount} lines) is within optimal limits.`);
  }

  // 3. Required Section Headers Check
  const sectionChecks = [
    {
      name: 'Purpose & Scope',
      regex: /#+.*?(purpose|scope|tujuan)/i,
      critical: true
    },
    {
      name: 'Strict Guardrails / Batasan',
      regex: /#+.*?(strict\s*guardrails|guardrails|batasan|rules|prohibited|dilarang)/i,
      critical: true
    },
    {
      name: 'Execution Workflow',
      regex: /#+.*?(workflow|execution\s*workflow|alur\s*kerja|steps|tahapan)/i,
      critical: true
    },
    {
      name: 'Verification Checklist',
      regex: /#+.*?(verification\s*checklist|checklist|kriteria\s*verifikasi|verification)/i,
      critical: true
    }
  ];

  for (const check of sectionChecks) {
    if (check.regex.test(content)) {
      logPass(`Found required section: "${check.name}"`);
    } else {
      if (check.critical) {
        logFail(`Missing required section: "${check.name}". Add a header matching this section to guide AI behavior.`);
        hasErrors = true;
      } else {
        logWarn(`Recommended section missing: "${check.name}".`);
        warningCount++;
      }
    }
  }

  // 4. Progressive Disclosure / References Directory Check
  const refDir = path.join(skillDir, 'references');
  if (lineCount > 300 && !fs.existsSync(refDir)) {
    logWarn('File is > 300 lines but no "references/" directory was found to store detailed docs.');
    warningCount++;
  } else if (fs.existsSync(refDir)) {
    logPass('Found "references/" folder for progressive disclosure.');
  }

  // Final Summary
  console.log(`\n${COLORS.bright}--- Summary ---${COLORS.reset}`);
  if (hasErrors) {
    logFail(`Validation FAILED with errors. Please fix the issues above.`);
    process.exit(1);
  } else if (warningCount > 0) {
    logWarn(`Validation PASSED with ${warningCount} warning(s). Review recommendations above for optimal quality.`);
    process.exit(0);
  } else {
    logPass(`Validation PASSED perfectly! 100% compliance with Antigravity skill standards.`);
    process.exit(0);
  }
}

// CLI Execution
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node validate_skill.js <path-to-skill-dir-or-SKILL.md>');
  process.exit(1);
}

validateSkill(args[0]);
