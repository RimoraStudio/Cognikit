# Cognikit Marketplace Platform

> A full marketplace platform for AI Agent Skills. Browse, search, install, rate, and submit skills.
> Live at **cognikit.com**

---

## Overview

Cognikit is a full marketplace platform for AI Agent Skills. Users can browse, search, install, rate, and submit skills. It serves as both a discovery platform and a submission portal for skill authors.

---

## Tech Stack

| Layer        | Technology                                  |
| ------------ | ------------------------------------------- |
| Framework    | Next.js 15 (App Router, RSC)                |
| Styling      | Tailwind CSS v4                             |
| Database     | PostgreSQL (Neon serverless)                |
| ORM          | Prisma                                      |
| Auth         | NextAuth.js (GitHub OAuth)                  |
| Search       | Algolia or Meilisearch                      |
| Deployment   | Vercel                                      |

---

## Features

### For Users (Skill Consumers)

| Feature | Description |
| --- | --- |
| Browse by category | design, engineering, productivity, devops, etc. |
| Search | by name, tag, or description |
| Skill detail page | full description, install command, references, changelog, GitHub link, author profile |
| One-click copy | copy install command to clipboard |
| Rate skills | 1–5 stars with optional review |
| Bookmark / favorite | save skills for later |
| Skill stats | installs, stars, last updated |

### For Authors (Skill Creators)

| Feature | Description |
| --- | --- |
| Submit via GitHub PR | skill auto-detected from PR to cognikit monorepo |
| Author dashboard | list of submitted skills, stats, ratings |
| Edit metadata | description, tags, category |
| Publish versions | new version bumps with changelog |
| Adoption metrics | installs, ratings, trends over time |

### For the Platform

| Feature | Description |
| --- | --- |
| GitHub auto-sync | detect new skills and version bumps from repos |
| Auto-generate pages | skill detail pages from `SKILL.md` frontmatter |
| Featured skills | curated homepage highlights |
| Trending skills | based on recent installs/stars |
| Category pages | `/categories/[slug]` |
| Author pages | `/authors/[username]` |
| Search with filters | category, tags, license, min rating |

---

## Database Schema

Key Prisma models:

### User

```prisma
model User {
  id        String   @id @default(cuid())
  githubId  String   @unique
  username  String   @unique
  avatar    String?
  bio       String?
  createdAt DateTime @default(now())

  skills    Skill[]
  ratings   Rating[]
  bookmarks Bookmark[]
  installs  Install[]
}
```

### Skill

```prisma
model Skill {
  id          String   @id @default(cuid())
  name        String   @unique
  displayName String
  description String
  version     String
  license     String
  category    String
  tags        String[]
  githubUrl   String
  docs        String?
  authorId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  featured    Boolean  @default(false)
  status      SkillStatus @default(PUBLISHED)

  author      User      @relation(fields: [authorId], references: [id])
  versions    SkillVersion[]
  ratings     Rating[]
  bookmarks   Bookmark[]
  installs    Install[]

  @@index([category])
  @@index([featured])
}

enum SkillStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

### SkillVersion

```prisma
model SkillVersion {
  id        String   @id @default(cuid())
  skillId   String
  version   String
  changelog String
  createdAt DateTime @default(now())

  skill     Skill @relation(fields: [skillId], references: [id])

  @@index([skillId])
}
```

### Rating

```prisma
model Rating {
  id        String   @id @default(cuid())
  skillId   String
  userId    String
  score     Int      // 1–5
  review    String?
  createdAt DateTime @default(now())

  skill     Skill @relation(fields: [skillId], references: [id])
  user      User  @relation(fields: [userId], references: [id])

  @@unique([skillId, userId])
}
```

### Bookmark

```prisma
model Bookmark {
  id        String   @id @default(cuid())
  skillId   String
  userId    String
  createdAt DateTime @default(now())

  skill     Skill @relation(fields: [skillId], references: [id])
  user      User  @relation(fields: [userId], references: [id])

  @@unique([skillId, userId])
}
```

### Install

```prisma
model Install {
  id        String   @id @default(cuid())
  skillId   String
  userId    String?
  createdAt DateTime @default(now())

  skill     Skill @relation(fields: [skillId], references: [id])
  user      User? @relation(fields: [userId], references: [id])

  @@index([skillId])
}
```

### Category

```prisma
model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
}
```

---

## Page Structure (App Router)

```
app/
├── layout.tsx                    # Root layout: nav, footer
├── page.tsx                      # Homepage: featured, trending, categories
├── skills/
│   ├── page.tsx                  # All skills with search + filters
│   └── [name]/
│       └── page.tsx              # Skill detail page
├── categories/
│   └── [slug]/
│       └── page.tsx              # Category page
├── authors/
│   └── [username]/
│       └── page.tsx              # Author profile page
├── dashboard/
│   ├── page.tsx                  # Author dashboard
│   └── skills/
│       └── [name]/
│           └── edit/page.tsx     # Edit skill metadata
├── submit/
│   └── page.tsx                  # Submit new skill (GitHub PR flow)
├── search/
│   └── page.tsx                  # Search results
└── api/
    ├── skills/route.ts           # GET list, POST create
    ├── skills/[name]/route.ts    # GET detail, PUT update
    ├── ratings/route.ts          # POST rating
    └── sync/route.ts             # POST webhook from GitHub
```

### Route Summary

| Route | Type | Purpose |
| --- | --- | --- |
| `/` | RSC | Homepage: featured, trending, categories |
| `/skills` | RSC + search | All skills with filters |
| `/skills/[name]` | RSC (SSG) | Skill detail page |
| `/categories/[slug]` | RSC | Category listing |
| `/authors/[username]` | RSC | Author profile + their skills |
| `/dashboard` | RSC (auth) | Author dashboard |
| `/dashboard/skills/[name]/edit` | Client (auth) | Edit skill metadata |
| `/submit` | Client (auth) | GitHub PR submission flow |
| `/search` | RSC + search | Search results |
| `/api/skills` | Route handler | GET list, POST create |
| `/api/skills/[name]` | Route handler | GET detail, PUT update |
| `/api/ratings` | Route handler | POST rating |
| `/api/sync` | Route handler | GitHub webhook receiver |

---

## Design Direction

- **Aesthetic:** Clean, developer-focused
- **Theme:** Dark mode default (developers prefer dark)
- **Typography:** Monospace for install commands and code; sans-serif for prose
- **Layout:** Card-based skill listing
- **Chrome:** Minimal. Focus on content.
- **Performance targets (Core Web Vitals):**

| Metric | Target |
| --- | --- |
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |

---

## GitHub Integration

| Capability | Detail |
| --- | --- |
| OAuth login | GitHub via NextAuth.js |
| Skill detection | Auto-detect skills from PRs to the cognikit monorepo |
| Webhook | On PR merge → auto-create skill entry |
| Metadata sync | Auto-sync from `SKILL.md` frontmatter |
| Repo linking | Each skill links to its GitHub repo |

### `SKILL.md` Frontmatter (expected)

```yaml
---
name: my-skill
displayName: My Skill
description: A skill that does something useful
version: 1.0.0
license: MIT
category: productivity
tags: [automation, cli]
githubUrl: https://github.com/user/my-skill
---
```

---

## Roadmap

### Phase 1: MVP (static + search)

- [ ] Static skill catalog from `registry.json`
- [ ] Search (client-side or Algolia)
- [ ] Skill detail pages
- [ ] Install command copy
- [ ] GitHub links

### Phase 2: User accounts

- [ ] GitHub OAuth login
- [ ] Ratings and reviews
- [ ] Bookmarks
- [ ] Author profiles

### Phase 3: Author tools

- [ ] Author dashboard
- [ ] Submission flow
- [ ] Adoption metrics
- [ ] Version management

### Phase 4: Platform features

- [ ] Trending algorithms
- [ ] Featured curation
- [ ] Category management
- [ ] API for third-party integration

### Phase 5: Marketplace

- [ ] Paid skills (Stripe integration)
- [ ] Skill bundles
- [ ] Team / organization accounts
- [ ] Enterprise self-hosted registry

---

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
#  - DATABASE_URL (Neon PostgreSQL)
#  - NEXTAUTH_SECRET
#  - GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET
#  - ALGOLIA_* or MEILISEARCH_*
#  - GITHUB_WEBHOOK_SECRET

# Run Prisma migrations
npx prisma migrate dev

# Seed the database
npm run seed

# Start dev server
npm run dev
```

---

*This document is a planning specification, not an implementation.*
