---
name: skill-creator
description: Use this skill when creating, authoring, scaffolding, updating, or revising Antigravity skills or plugin packages. DO NOT trigger for general code writing or bug fixing.
---

# Skill Creator & Reviser Meta-Skill

## 🎯 Purpose & Scope
This meta-skill guides both the **creation of new skills/plugins** and the **updating/revision of existing skills/plugins**. It ensures any additions or modifications adhere to trigger scoping, line budgeting (<300 lines), strict guardrails, and automated validation via `validate_plugin.js`.

## 🛑 Strict Guardrails
- **DO NOT** modify or create a skill without a kebab-case `name` and specific `description` containing positive AND negative triggers.
- **DO NOT** write monolithic skills over 500 lines. Use the `references/` directory for extended documentation when revising.
- **DO NOT** consider a created or revised skill complete until `node scripts/validate_plugin.js <plugin-path>` (or `validate_skill.js`) passes without errors.

## 📋 Execution Workflow

### Mode A: Scaffolding New Plugins / Skills
1. **Gather Requirements**: Identify plugin domain, skill list, triggers, and negative constraints.
2. **Generate Structure**: Create `plugins/<plugin-name>/` package with `plugin.json`, `README.md`, and `skills/<skill-name>/SKILL.md`.
3. **Automated Validation**: Run `node scripts/validate_plugin.js plugins/<plugin-name>`.

### Mode B: Updating & Revising Existing Plugins / Skills
1. **Locate & Read**: Locate the target skill (`plugins/...` or `.agents/skills/...`) and read existing `SKILL.md` and `references/`.
2. **Apply Revisions**:
   - Add new guardrails, update workflows, or refine trigger descriptions as requested.
   - If line count exceeds 300 lines after revisions, extract detailed sections into `references/`.
3. **Automated Re-validation**:
   - Re-run `node scripts/validate_plugin.js <plugin-path>` (or `validate_skill.js`).
   - Fix any warnings/errors introduced during revision.

## 📚 References
- For detailed design patterns, consult [references/skill-authoring-guide.md](file://./references/skill-authoring-guide.md).
- Master template located at [templates/SKILL_TEMPLATE.md](file://./templates/SKILL_TEMPLATE.md).

## 🔍 Verification Checklist
- [ ] Frontmatter `name` is kebab-case and `description` includes negative trigger constraints.
- [ ] `SKILL.md` line count is $\le 300$ lines.
- [ ] Required section headers (Purpose, Guardrails, Workflow, Checklist) are present.
- [ ] Executed `node scripts/validate_skill.js <skill-path>` and received `[✔ PASS]`.
