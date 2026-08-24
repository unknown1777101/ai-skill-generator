# Skill Creator

This directory contains the `skill-creator` meta-skill, which is responsible for designing, authoring, auditing, and maintaining high-quality Agent Skills for Google Antigravity.

---

## 🎯 What is this Skill for?

This meta-skill guides the design and generation of new kebab-case skills and plugins for Antigravity. It ensures all created skills follow strict guardrails, remain single-purpose, and separate procedural logic from background reference knowledge.

### Key Capabilities:
- **CREATE**: Scaffold new skills with standard frontmatter, headers, and automated tests.
- **AUDIT**: Score any existing skill folder on a 100-point scale against the quality gate.
- **IMPROVE**: Refactor/optimize descriptions, instructions, and trigger terms.
- **SPLIT / MERGE**: Cleanly modularize large instruction files or combine overlapping ones.

---

## 📖 Usage Guide (Panduan Penggunaan)

This skill is automatically triggered when you ask the agent to create, audit, improve, split, or merge skills.

### How to Activate/Trigger:
- **Auto-activation**: Antigravity agents load this skill when you prompt with words like: *"design a new skill for...", "buat skill baru untuk...", "audit skill X"*
- **Manual invocation**: You can prompt the agent to explicitly use it:
  > "Gunakan skill `skill-creator` untuk membuat skill baru untuk [tugas]"

### Path Selection:
When generating a new skill, the agent is required to ask where to place the output files:
1. **Current Project Folder**: Saves locally in `.agents/skills/<skill-name>/`.
2. **Global Antigravity Config**: Saves globally in `~/.gemini/config/skills/<skill-name>/`.
3. **Custom Path**: Saves in any custom directory specified by the user.

---

## 📋 CLI Validation

Every skill generated should be verified using the validation scripts included in this package:
```bash
# Validate a single skill folder
npx validate-skill path/to/skill-dir

# Validate a full plugin package
npx validate-plugin path/to/plugin-dir
```
