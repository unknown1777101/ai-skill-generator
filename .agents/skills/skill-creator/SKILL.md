---
name: skill-creator
description: Designs, creates, audits, improves, splits, merges, updates, and maintains Agent Skills for Google Antigravity using the SKILL.md standard. Use when creating, reviewing, or architecture-designing skills. DO NOT trigger for general application code writing or bug fixing.
---

# Skill Authoring & Creator Meta-Skill

## 🎯 Purpose & Scope
This meta-skill is responsible for designing, authoring, auditing, and maintaining high-quality Agent Skills for Google Antigravity.
Its primary goals are:
- Make each skill focused on **one primary responsibility**.
- Keep skill activation precise with explicit positive AND negative triggers.
- Optimize for **progressive disclosure** (procedure in `SKILL.md`, knowledge in `references/`, automation in `scripts/`).
- Prevent duplicate or overlapping skills.
- Enforce deterministic instructions and automated quality validation.

## 🛑 Strict Guardrails
- **DO NOT** create monolithic skills > 500 lines. Move large documentation, specifications, and anti-patterns into `references/`.
- **DO NOT** use vague instructions like "do it properly". Use observable, deterministic rules.
- **DO NOT** silently invent missing values or project information. Ask the user if required inputs are unknown.
- **DO NOT** consider any skill complete until `node scripts/validate_plugin.js` or `node scripts/validate_skill.js` passes with 100% compliance.
- **MUST ASK FOR OUTPUT PATH**: When generating a new skill, you **must** explicitly ask the user where the output should be saved. Do not make assumptions.

## 📌 Lifecycle Modes & Workflows

### 1. CREATE Mode (New Skill / Plugin)
1. **Identify Single Purpose**: Confirm single primary responsibility and kebab-case name.
2. **Define Triggers**: Write specific description with positive activation terms AND negative constraints ("DO NOT trigger for...").
3. **Ask for Output Path (MANDATORY)**: Ask the user where they want the generated skill files to be saved. You must present the following options:
   - **Current Project Folder**: Save in the active workspace under `.agents/skills/<skill-name>/` or `plugins/<plugin-name>/`.
   - **Global Antigravity Config**: Save globally under `~/.gemini/config/skills/<skill-name>/` (on Windows: `%USERPROFILE%\.gemini\config\skills\<skill-name>\`).
   - **Custom Path**: Save in a path explicitly specified by the user.
4. **Scaffold Structure**: Generate the files in the chosen target location with mandatory headers (*Purpose*, *When to Use*, *When Not to Use*, *Inputs*, *Workflow*, *Decision Rules*, *Validation*, *Output*).
5. **Validate**: Run `node scripts/validate_plugin.js` (or `validate_skill.js`) on the saved path.

### 2. AUDIT Mode (Evaluate Skill Quality 0–100)
Score skill against the 100-point quality gate:
- Scope Clarity (15 pts), Activation Quality (15 pts), Instruction Quality (15 pts), Context Efficiency (15 pts), Structure (10 pts), Reference Separation (10 pts), Duplication Control (10 pts), Validation (5 pts), Maintainability (5 pts).

### 3. IMPROVE & UPDATE Mode
- Preserve core responsibility while sharpening activation description.
- Remove redundant instructions and offload large documentation into `references/`.
- Re-run automated validation scripts.

### 4. SPLIT & MERGE Mode
- **SPLIT**: If a skill contains multiple unrelated responsibilities or >500 lines, split into modular focused skills.
- **MERGE**: If two skills have >80% overlap or users cannot distinguish triggers, merge them cleanly.

## 📥 Inputs & Outputs
- **Inputs**: Skill/Plugin domain, purpose, activation conditions, target files, and **chosen output path**.
- **Output**: Validated `SKILL.md` (or full Antigravity Plugin package) passing quality gate, saved at the location chosen by the user.

## 📚 References
- Complete authoring standard & scoring guide: [references/skill-authoring-guide.md](file://./references/skill-authoring-guide.md).
- Master template: [templates/SKILL_TEMPLATE.md](file://./templates/SKILL_TEMPLATE.md).

## 🔍 Quality Gate Checklist
- [ ] Single primary responsibility.
- [ ] Lowercase kebab-case name.
- [ ] Activation description contains positive triggers & negative constraints.
- [ ] Scope & Out-of-scope tasks defined.
- [ ] Required inputs & outputs clear.
- [ ] Deterministic, observable workflow steps.
- [ ] Large docs offloaded to `references/`.
- [ ] Automated validator script executed & passed (`[✔ PASS]`).
