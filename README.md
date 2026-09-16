<div align="center">

# ☯ Alterras ☯

### A custom tabletop RPG companion app — character sheets, world lore & GM tools

_Personal project: a Next.js app built to run a homebrew D&D-style tabletop campaign_
_Second generation of [DnD Spellbook](https://github.com/AlexJYad/DnD-spellbook) — rebuilt from a frontend-only CRA app into a full-stack Next.js one_

[![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[**🔗 Live demo**](https://deploy-next-dnd.vercel.app) · [**📁 Source code**](https://github.com/AlexJYad/next-dnd) · [**🚀 Deployment repo**](https://github.com/AlexJYad/deploy-next-dnd) · [**📖 Predecessor (v1)**](https://github.com/AlexJYad/DnD-spellbook)

</div>

---

## 📖 About

The app that runs a homebrew tabletop RPG campaign set in **Alterras** — a continent named after Alter, the goddess who created life. Instead of a printed character sheet and a binder of house rules, players log in, manage their own character, browse the world's lore, explore the custom magic system as an interactive graph, and look up locations on an in-world map. A Game Master role gets a dedicated admin panel to create and edit any player's sheet.

The magic system itself is a homebrew replacement for D&D spell slots: a **mana-pool** economy with **GURPS-inspired prerequisite spell trees**, first modeled as a standalone JSON dataset and rendered here as a live, explorable graph.

> _"Мир, в котором разворачиваются события, называется Альтерас — континент, названный в честь Альтер, богини, сотворившей жизнь."_

---

## 🔁 Migration from v1

This is a **full rewrite of [DnD Spellbook](https://github.com/AlexJYad/DnD-spellbook)** ([live v1](https://yad-spellbook.netlify.app)) — the original companion app for the same campaign, built in 2024 on Create React App with all content stored in static JSON files and no backend at all.

v1 did its job at the table, but its limitations were structural: JSON-file "authentication" with credentials sitting in the client bundle, no way for players to persist changes to their own sheet, and content that could only be updated by editing files and redeploying. Those were listed as the project's own future improvements — _add a backend (Firebase / Supabase), replace JSON-based auth with real authentication, add a map system_ — and this repository is that rework.

|                      | v1 — DnD Spellbook                             | v2 — this repo                                                   |
| -------------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| **Framework**        | React + CRA (`react-scripts`, webpack 5)       | Next.js 16 App Router, React 19, TypeScript                      |
| **Data**             | Static JSON in `public/data/`                  | Supabase Postgres with generated types                           |
| **Auth**             | Demo credentials inside JSON, client-side only | Email/password + `bcryptjs`, server sessions via `iron-session`  |
| **Roles**            | —                                              | guest / player / admin, enforced server-side                     |
| **Character sheets** | Read-only, rendered from JSON                  | Editable and persisted per player; GM can edit anyone's          |
| **Magic system**     | Spell lists                                    | Interactive prerequisite tree (Cytoscape) on a mana-pool economy |
| **Maps**             | Planned, never finished                        | Implemented with Leaflet + markers stored in Supabase            |
| **Styling**          | CSS, BEM (in progress)                         | Tailwind CSS 4 + component CSS, light/dark theme                 |
| **Hosting**          | Netlify (static)                               | Vercel (SSR)                                                     |

The world itself — Alterras, its lore, gods and rules — carries over unchanged; what changed is everything underneath it.

---

## ✨ Features

|     | Implemented                                                                                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 🔐  | Custom auth (email/password via Supabase, sessions via `iron-session`) with a guest/demo login and three roles — guest, player, admin |
| 🧙  | Personal character sheet: stats, currency/wallet, inventory                                                                           |
| 🌳  | Interactive skill/spell tree ([Cytoscape.js](https://js.cytoscape.org/)) driven by the homebrew mana-pool magic system                |
| 📖  | In-world lore section — culture, economy, history, magic, politics, religion                                                          |
| 🗺️  | Interactive maps ([Leaflet](https://leafletjs.com/) / `react-leaflet`) with custom markers stored in Supabase                         |
| 🛠️  | GM/admin panel to create and edit any player's character sheet                                                                        |
| 🌗  | Light/dark theme via `next-themes`                                                                                                    |
| 🗄️  | Supabase Postgres backend with generated TypeScript types                                                                             |

---

## 🛠️ Tech stack

- **Next.js 16** (App Router) — **React 19**, **TypeScript**
- **Supabase** — Postgres database, generated types, service-role admin client
- **iron-session** + **bcryptjs** — custom session/auth layer (not Supabase Auth)
- **Cytoscape.js** — interactive skill/spell graph
- **Leaflet** / **react-leaflet** — interactive world maps
- **Tailwind CSS 4**
- **next-themes** — light/dark mode

---

## 📂 Repository structure

```
next-dnd/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/         # login / logout route handlers
│   │   │   └── maps/         # map data route handlers
│   │   ├── auth/             # login page
│   │   └── main/
│   │       ├── admin/        # GM character editor
│   │       ├── lor/          # world lore pages (culture, history, magic, ...)
│   │       ├── maps/         # Leaflet map viewer
│   │       ├── profile/      # player's own character sheet
│   │       └── spells/       # interactive skill/spell tree
│   ├── components/           # Header, SkillTree, GodCard, ImageWithFallback, ...
│   ├── data/                 # skills.ts — spell tree graph data
│   └── lib/                  # Supabase clients, session, roles, data fetchers
└── public/
```

---

## 🚀 Running locally

```bash
git clone https://github.com/AlexJYad/next-dnd.git
cd next-dnd
npm install
```

Create a `.env.local` with your own Supabase project credentials:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

The production build (same code, deployed on Vercel) lives in the companion [`deploy-next-dnd`](https://github.com/AlexJYad/deploy-next-dnd) repository.

---

## 🧭 Roadmap

### In progress

- [ ] Currency/wallet UI components on the character sheet
- [ ] Inventory & skills editors
- [ ] Stat box redesign — modifier-prominent card layout
- [ ] General CSS layout fixes

### Ideas

- [ ] Automated tests for auth and role-gated routes
- [ ] Finish the spinning-disc / transformation-style flourishes on the lore pages
- [ ] Expand the map layer to link markers back to lore entries

---

## 👤 Author

**Aleksandr Iakovlev (AlexJYad)**
[GitHub](https://github.com/AlexJYad) · Gijón, Asturias, Spain

---

<div align="center">

_☯ Alterras — a world of dualities, run for a homebrew table ☯_

</div>
