# Antigravity Skill Generator & Plugin Validator

A modular Antigravity plugin package containing the `skill-creator` meta-skill and automated validator tools (`validate_plugin.js` & `validate_skill.js`).

## Installation via Git Repository

Install this skill generator package into any project via Git repository:

```bash
npm install git+https://github.com/unknown1777101/ai-skill-generator.git
```

## Enable in Project `.agents/skills.json`
In your target project, link the skills entry in `.agents/skills.json`:

```json
{
  "entries": [
    { "path": "node_modules/ai-skill-generator/.agents/skills" }
  ]
}
```

## CLI Commands

Run validation directly in any project:
```bash
npx validate-plugin path/to/my-plugin
npx validate-skill path/to/SKILL.md
```
