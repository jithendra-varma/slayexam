# Team Rules & Task Assignment — slayexam.com

## What We're Building

A website for Indian bachelor's degree students to view their college syllabus alongside curated YouTube videos — one place to see every topic they need to study and watch relevant video explanations for each.

---

## Task Assignment

### Hari — Backend & Infrastructure
- Set up the project stack (framework, database, hosting)
- Build the backend: APIs to serve syllabus data and video links by branch/subject
- Handle database design (storing branches, subjects, topics, video links)
- Manage deployment (domain, hosting, CI/CD)
- Final code review before anything goes live

### Jithu — Frontend & UI
- Build the website UI: homepage, branch selection page, subject page, video viewer
- Make it mobile-friendly (most students use phones)
- Connect frontend to Hari's APIs
- Ensure the syllabus + video layout is clean and easy to navigate

### Subbu — Content & Data
- Collect syllabuses for each branch (CSE, ECE, Mechanical, Civil, etc.) from Indian universities (Anna University, VTU, JNTUH, Mumbai University, etc.)
- Find YouTube videos for each syllabus topic (prefer well-known channels like NPTEL, Gate Smashers, Neso Academy, etc.)
- Structure the data in a consistent format (JSON or spreadsheet) that Jithu can load into the database
- Keep the content updated as syllabuses change

---

## Data Format (Subbu → Jithu handoff)

Subbu should organize collected data like this:

```json
{
  "university": "Anna University",
  "branch": "CSE",
  "semester": 3,
  "subject": "Data Structures",
  "topics": [
    {
      "name": "Arrays and Linked Lists",
      "youtube_links": [
        "https://youtube.com/watch?v=...",
        "https://youtube.com/watch?v=..."
      ]
    }
  ]
}
```

---

## Coordination Rules

- **Daily sync:** Push your progress every day so the team can see what's done
- **Block early:** If you're stuck or waiting on someone else, say so immediately — don't sit blocked silently
- **Hari decides stack** — Once decided, everyone aligns to it; no switching mid-project
- **Subbu delivers data first** — Frontend and backend can't be built without knowing the data structure; Subbu should finalize the format and at least one branch's data early
- **Hari and Jithu agree on API contracts** — Define the API request/response shape before Jithu starts connecting the frontend

---

## Priority Order (MVP)

1. Subbu: finalize data format + collect syllabus for 2 branches (CSE, ECE)
2. Hari: set up stack, database, and 1 working API endpoint
3. Jithu: build branch selection page + subject/topic listing page
4. All: integrate and test end-to-end with real data
5. Subbu: fill in remaining branches
6. Jithu: polish UI, add video player
7. Hari: deploy to slayexam.com
