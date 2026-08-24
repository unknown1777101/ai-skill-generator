# Antigravity Skill Generator & Plugin Validator

A modular Antigravity plugin package containing the `skill-creator` meta-skill and automated validator tools (`validate_plugin.js` & `validate_skill.js`).

---

## 🚀 Installation

### 1. Global Installation (Recommended for Personal Use)
Installs `skill-creator` globally across all projects on your machine (`~/.gemini/config/skills/skill-creator`):

```bash
npm install -g git+https://github.com/unknown1777101/ai-skill-generator.git
```

### 2. Local Project Installation (For Team Projects)
Installs the package locally into a specific project's `node_modules`:

```bash
npm install git+https://github.com/unknown1777101/ai-skill-generator.git
```

---

## 🛠️ CLI Commands

### Manage the skill-creator meta-skill
You can cleanly update or uninstall the global `skill-creator` meta-skill directory using the CLI:
```bash
npx skill-creator update      # Deletes the old global skill folder and copies the latest files
npx skill-creator uninstall   # Deletes the global skill folder
```

### Run Validator Tools
Run validator tools directly in any project:
```bash
npx validate-plugin path/to/my-plugin
npx validate-skill path/to/SKILL.md
```

---

## 🗑️ Uninstallation

### Uninstall Global
To remove the package globally:
```bash
npm uninstall -g ai-skill-generator
npx skill-creator uninstall
```

### Uninstall Local Project
To remove the package from a local project:
```bash
npm uninstall ai-skill-generator
```
