# Antigravity Skill Authoring Guide

## Overview
Antigravity Skills extend AI capabilities by providing domain-specific workflows, guardrails, and templates. Creating high-quality skills ensures fast execution and zero context drift.

## Key Principles

### 1. Frontmatter Trigger Design
- **`name`**: Must use kebab-case (e.g. `react-modal-generator`, `sql-schema-migrator`).
- **`description`**: Keep under 300 characters. Must define:
  - **Positive Trigger**: What specific task triggers this skill.
  - **Negative Trigger**: What tasks must NOT trigger this skill.

### 2. Context Window Budgeting
- Keep `SKILL.md` under 300 lines (hard limit: 500 lines).
- Store extensive docs, schema definitions, or anti-patterns in the `references/` folder.

### 3. Guardrails & Negative Constraints
- Use clear "DO NOT" / "JANGAN" statements.
- Explicitly list prohibited actions, boundaries, and mandatory preconditions.

### 4. Automated Validation
- Every skill generated must pass `node scripts/validate_skill.js <skill-path>`.
