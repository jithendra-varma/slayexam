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

## Stack

(TBD — to be defined as development begins)

## Resources

- **Repository:** https://github.com/jithendra-varma/slayexam
- **Main contact:** Jithu (jithendra9367@gmail.com)
