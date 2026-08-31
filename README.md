# Antigravity Skill Creator & Plugin Validator

A modular Antigravity plugin package containing the `skill-creator` meta-skill and automated validator tools (`validate_plugin.js` & `validate_skill.js`).

---

## 🚀 Installation

### 1. Global Installation (Recommended for Personal Use)
Installs `skill-creator` globally across all projects on your machine (`~/.gemini/config/skills/skill-creator`):

```bash
npm install -g git+https://github.com/unknown1777101/ai-skill-creator.git
```

### 2. Local Project Installation (For Team Projects)
Installs the package locally into a specific project's `node_modules`:

```bash
npm install git+https://github.com/unknown1777101/ai-skill-creator.git
```

---

## 🛠️ CLI Commands

All CLI commands can be executed directly in the terminal (PowerShell / CMD) without `npx` after running `npm link` or `npm install -g`:

| Action | Primary Command | 1-Word Shortcut Alias |
| :--- | :--- | :--- |
| **Update / Install Global** | `skill-creator update` | `skill-creator-update` |
| **Uninstall Global** | `skill-creator uninstall` | `skill-creator-uninstall` |
| **Validate Skill** | `skill-creator validate <path>` | `skill-creator-validate <path>`<br>`skill-validate <path>`<br>`validate-skill <path>` |
| **Validate Plugin** | `skill-creator validate-plugin <path>` | `plugin-validate <path>`<br>`validate-plugin <path>` |

*(Note: You can also execute via `npx skill-creator ...` if the package is not installed globally).*
