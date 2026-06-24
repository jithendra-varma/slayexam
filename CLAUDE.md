# slayexam.com — Development Guide

## Project Overview

**slayexam.com** is a web application that serves curated YouTube playlists tailored to college students based on their academic branch/department.

**MVP:** Stream branch-specific YouTube playlists (CSE, ECE, Mechanical, Civil, etc.)

**Team:** Jithu (lead), Hari, Subbu

## Team & Roles

- **Jithu (jithendra9367@gmail.com)** — Lead developer, sole pusher to `main`
- **Hari** — Developer on `hari` branch
- **Subbu** — Developer on `subbu` branch

## Git Branching Model

```
main (protected)
├── hari → Hari's development branch
├── jithu → Jithu's development branch
└── subbu → Subbu's development branch
```

**Branch Rules:**
- Each developer works on their own branch (e.g., `hari`, `jithu`, `subbu`)
- All code merges to `main` via pull request (PR)
- Only **Jithu** can approve and merge PRs to `main`
- `main` is production-ready and protected against direct pushes

## Workflow

1. **Develop** on your personal branch (`git checkout <your-branch>`)
2. **Commit** regularly with clear messages
3. **Push** to your branch: `git push origin <your-branch>`
4. **Create PR** when feature is ready for review
5. **Jithu reviews** and merges to `main`

## Stack

(TBD — to be defined as development begins)

## Resources

- **Repository:** https://github.com/jithendra-varma/slayexam
- **Main contact:** Jithu (jithendra9367@gmail.com)
