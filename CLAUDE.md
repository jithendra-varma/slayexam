# slayexam.com — Development Guide

## Project Overview

**slayexam.com** is a web application that serves curated YouTube playlists tailored to college students based on their academic branch/department.

**MVP:** Stream branch-specific YouTube playlists (CSE, ECE, Mechanical, Civil, etc.)

**Team:** Jithu (lead), Hari, Subbu

## Team & Roles

- **Jithu** — Lead developer
- **Hari** — Developer
- **Subbu** — Developer

All team members can push & pull from `main` directly.

## Git Branching Model

```
main (shared development)
├── hari → Optional personal branch for Hari
├── jithu → Optional personal branch for Jithu
└── subbu → Optional personal branch for Subbu
```

**Branch Rules:**
- **Work on `main`** — All team members push/pull directly from main
- **Optional:** Use personal branches (hari, jithu, subbu) for isolated feature work, then merge to main
- **Stay in sync:** Always `git pull origin main` before pushing
- **Commit history:** All commits are tracked. Can revert to any previous commit if needed

## Workflow

1. **Pull latest:** `git pull origin main` (stay in sync)
2. **Create/edit files** on your local machine
3. **Commit regularly:** `git commit -m "Clear message"`
4. **Push to main:** `git push origin main`
5. **Everyone sees updates immediately** ✅

**If using personal branches:**
1. Work on your branch: `git checkout hari`
2. Push: `git push origin hari`
3. Switch to main: `git checkout main`
4. Merge: `git merge hari` or create a PR on GitHub
5. Push: `git push origin main`

## Commit Rules & Standards

**Commit Message Format:**
```
<type>: <subject>

<optional body>
```

**Types:**
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style (formatting, spacing, etc.)
- `refactor:` — Code refactoring without changing functionality
- `test:` — Test-related changes
- `chore:` — Build, dependencies, configuration changes

**Examples:**
```bash
git commit -m "feat: add youtube playlist filter by branch"
git commit -m "fix: resolve login form validation error"
git commit -m "docs: update CLAUDE.md with commit rules"
git commit -m "refactor: simplify playlist fetching logic"
```

**Commit Best Practices:**
1. **Commit often** — Small, logical commits are better than one huge commit
2. **Clear messages** — Be specific about what changed and why
3. **One thing per commit** — Don't mix unrelated changes
4. **Test before pushing** — Ensure your code works locally
5. **Pull before push** — Always `git pull origin main` before pushing

**Forbidden:**
- ❌ Commit messages like "fix", "update", "changes"
- ❌ Committing without testing locally
- ❌ Pushing sensitive data (passwords, API keys) — Add to `.gitignore`

## Stack

(TBD — to be defined as development begins)

## Resources

- **Repository:** https://github.com/jithendra-varma/slayexam
- **Main contact:** Jithu (jithendra9367@gmail.com)
