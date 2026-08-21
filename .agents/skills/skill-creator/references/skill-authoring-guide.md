# Google Antigravity Skill Authoring Standard & Reference

This guide establishes the authoritative standard for designing, creating, auditing, improving, splitting, merging, and maintaining Agent Skills for Google Antigravity.

---

## 💡 Operating Principles

### 1. One Skill, One Primary Responsibility
A skill must have one clear, focused job.
- **Good**: `voxel-modeling`, `frontend-development`, `code-review`, `marketing-copy`, `blender-asset-export`.
- **Bad**: `everything-3d`, `company-helper`, `developer-super-skill`, `all-marketing-and-sales`.
- *If a proposed skill contains multiple independent responsibilities, recommend splitting it.*

### 2. Optimize for Progressive Disclosure
Do not put every piece of domain knowledge inside `SKILL.md`. Follow this hierarchy:
```text
SKILL.md (Procedure & decision logic)
  └── references/ (Detailed domain knowledge, loaded on demand)
        └── scripts/ (Executable automation scripts)
```
- `SKILL.md` should contain ONLY information necessary to understand and execute the core workflow.
- Move large documentation, specifications, examples, edge cases, and background knowledge into `references/`.

### 3. Separate Procedure from Knowledge
- `SKILL.md` = What to do + how to decide (Workflow & Rules).
- `references/` = Detailed information needed while doing it.
- Do not turn `SKILL.md` into an encyclopedia.

### 4. Prefer Deterministic Instructions
Avoid vague instructions like *"Do it properly"*, *"Use best practices"*, *"Make it good"*.
Use observable, explicit instructions:
- *"Validate the output against the naming convention before finishing."*
- *"If the mesh contains non-manifold geometry, repair it before voxelization."*
- *"If required input is missing, ask for it before modifying files."*

### 5. Do Not Duplicate Project Knowledge
Reference authoritative sources (project rules, organization context, existing docs) rather than copying information into the skill.

### 6. CLI Testing Tools & Auto-Installation Prompts
When a skill requires external CLI testing/verification tools (such as **RDK** for Roblox Luau unit testing):
- **Provide Tool Info & Link**: State clearly which tool executes the tests (e.g. `rdk test`) and provide its official installation URL ([https://github.com/unknown1777101/roblox-development-kit](https://github.com/unknown1777101/roblox-development-kit)).
- **Check Availability**: Perform a pre-flight check (e.g. `rdk --version`).
- **Offer Installation**: If the tool is missing from PATH, inform the user, present the download link, and offer to execute the installation command (e.g. `cargo install rdk`) if permitted.

---

## 🔄 Skill Lifecycle Modes

Every skill operation must be classified under one of the following modes:

- **CREATE**: Create a new skill from scratch.
- **AUDIT**: Evaluate an existing skill against the quality gate (scored 0–100).
- **IMPROVE**: Refine an existing skill without changing its core purpose.
- **SPLIT**: Break an oversized or multi-responsibility skill into smaller skills.
- **MERGE**: Combine skills that have excessive overlap.
- **DESIGN**: Design architecture and contract before implementation.
- **MIGRATE**: Convert an existing workflow or prompt into a proper Antigravity skill.
- **UPDATE**: Update an existing skill while preserving backward compatibility.
- **DEPRECATE**: Identify a skill that should no longer be used and recommend a replacement.

---

## 📋 SKILL.md Design Standard

Every generated or revised `SKILL.md` should follow this standard structure:

```markdown
---
name: <lowercase-kebab-case-name>
description: <specific activation description explaining capability, positive triggers, and negative constraints>
---

# <Skill Title>

## 🎯 Purpose & Scope
[Brief explanation of the single primary responsibility]

## 📌 When to Use
[Clear list of trigger scenarios]

## 🛑 When Not to Use
[Explicit list of negative trigger conditions / out-of-scope tasks]

## 📥 Inputs
[Required and optional inputs. Never invent missing values]

## 📋 Workflow
[Actionable sequential steps: Inspect -> Decide -> Execute -> Validate -> Report]

## 🔀 Decision Rules
[Explicit decision trees for branching logic]

## 🔍 Validation
[How to verify output correctness before completing]

## 📤 Output
[Observable artifacts, files, reports, or decisions produced]

## 📚 References
[Links to optional/required reference docs in references/]

## 🔗 Related Skills
[Dependencies classified as Required, Optional, or Related]
```

---

## 🏷️ Naming Standard
- Use lowercase **kebab-case** (e.g., `skill-authoring`, `voxel-modeling`, `frontend-development`).
- Avoid CamelCase, snake_case, spaces, or generic names like `skill1` or `awesomeSkill`.
- Name describes capability, not creator or organization.

---

## 💯 Audit & Quality Gate (Score 0–100)

When auditing a skill, evaluate against these criteria:
- **Scope Clarity** (15 pts)
- **Activation Quality** (15 pts)
- **Instruction Quality** (15 pts)
- **Context Efficiency** (15 pts)
- **Structure** (10 pts)
- **Reference Separation** (10 pts)
- **Duplication Control** (10 pts)
- **Validation Strategy** (5 pts)
- **Maintainability** (5 pts)

### Quality Gate Checklist:
- [ ] One primary responsibility.
- [ ] Clear lowercase kebab-case name.
- [ ] Description explains capability and activation (with negative triggers).
- [ ] Scope is defined; out-of-scope work is identifiable.
- [ ] Required inputs & expected outputs are known.
- [ ] Workflow is actionable.
- [ ] Decision points are explicit where necessary.
- [ ] Validation exists where appropriate.
- [ ] Large reference material is offloaded to `references/`.
- [ ] Existing skills were considered for overlap.
- [ ] Dependencies are justified.
- [ ] Context efficiency is maintained (<300 lines recommended).
