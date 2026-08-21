---
name: {{skill_name}}
description: {{skill_description_with_triggers_and_negative_constraints}}
---

# {{skill_title}}

## 🎯 Purpose & Scope
{{purpose_description}}

## 🛑 Strict Guardrails
- **DO NOT** modify files outside the designated target folder without explicit approval.
- **DO NOT** introduce external third-party dependencies unless specified in requirements.
- **DO NOT** remove existing code docstrings or comments.

## 📋 Execution Workflow

1. **Step 1: Inspect & Analyze**
   - Review target files and dependencies before editing.
   - Verify non-null states and parameters.

2. **Step 2: Implement Changes**
   - Apply clean, modular modifications following project coding style.

3. **Step 3: Verification**
   - Run tests or verification commands to confirm zero runtime errors.

## 📚 References
- Detailed documentation and schemas can be offloaded to [references/](file://./references/).

## 🔍 Verification Checklist
- [ ] Code builds without errors or lint warnings.
- [ ] No extra files created outside target scope.
- [ ] Negative guardrails fully respected.
