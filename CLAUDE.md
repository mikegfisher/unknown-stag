# Asyncast — CLAUDE.md

## Project Overview
Asyncast is an async-first planning poker app for dev teams. Users create estimation sessions with issues, teammates vote on effort asynchronously (no meeting required), and the session owner reveals votes when satisfied with participation. Votes are hidden until revealed — this is a core, intentional product decision and must never be compromised.

## Tech Stack
- **Framework:** React 19 + Vite
- **Language:** TypeScript (strict mode)
- **Routing:** React Router v6
- **Backend:** Firebase (Firestore + Auth + Hosting)
- **Styling:** Tailwind CSS
- **Testing:** Vitest

## Code Style
- Follow modern TypeScript/React conventions
- Functional components only — no class components
- Use React hooks for state and side effects
- Single quotes, no semicolons, 2-space indentation
- Descriptive variable names over abbreviations
- Co-locate component files with their styles/tests

## Theming
- Dark mode is the default and current only mode
- All colors must use CSS custom properties (variables) — no hardcoded hex values anywhere in components
- Use a theme.css file to define all color tokens
- Design with light mode in mind as a future addition — if you add a color, add it in a way that a light mode variant could easily be added later

## Firestore Data Model

sessions/{sessionId}
  - name: string
  - ownerId: string
  - createdAt: timestamp
  - memberIds: string[]
  - integrations: object (reserved for future use, default {})

sessions/{sessionId}/issues/{issueId}
  - title: string
  - description: string
  - order: number
  - revealed: boolean
  - createdAt: timestamp
  - externalId: string (optional, for future Jira/Linear integration)
  - externalSource: string (optional, for future Jira/Linear integration)

sessions/{sessionId}/issues/{issueId}/votes/{userId}
  - userId: string
  - displayName: string
  - avatarUrl: string
  - value: number
  - updatedAt: timestamp

## Core Product Rules — Never Violate These
1. Vote values are never exposed until the session owner reveals them. Avatars of voters may be shown to indicate participation, but point values must remain hidden until reveal.
2. Voting is async — there is no concept of a "live session" or waiting for all members. Anyone can vote anytime before reveal.
3. Votes are upserts — a voter can change their vote any time before reveal. Store votes keyed by userId.
4. Reveal is the end state — there is no separate "closed" status. Revealed = done.
5. No AI-suggested point values — ever. It would anchor team thinking before blind voting, which defeats the purpose.

## Future Features (design-aware, not yet built)
- Slack notifications when votes come in or a reveal threshold is met
- Auto-reveal when a configurable % of memberIds have voted
- Write-back of final point value to external issue (Jira, Linear, GitHub)
- Import issues from Jira, Linear, or GitHub Issues
- Light/dark mode toggle

## Behavior Rules
- Always ask before deleting files or doing large-scale rewrites
- Always ask before changing the Firestore data model
- Never hardcode Firebase config values — use environment variables
- Open one focused PR per feature or task — no bundling unrelated changes
- Write Vitest unit tests for any utility functions
- Keep components small and single-purpose

## Branch Naming
- Features: feature/short-description
- Fixes: fix/short-description
- Chores: chore/short-description

## PR Description Format
Each PR should include:
- What was built and why
- Any data model changes
- Any assumptions made
- What still needs to be done (if anything)