# 📚 StoryCrafter  
*A structured world-building and story authoring studio*

StoryCrafter is a single-page web application designed to help writers plan, organize, and expand fictional universes. It supports story management, character creation, chapter drafting, and version history — all while staying fast, local-first, and distraction-free.

This project intentionally prioritizes **clarity of state**, **predictable navigation**, and **local persistence** over unnecessary backend complexity.

---

## ✨ Core Features

- 📝 Create and manage multiple stories  
- 🧍 Character creation per story  
- 📖 Chapter editor with version history  
- 🧭 Deterministic navigation (state-driven)  
- 💾 Persistent local storage (offline-friendly)  
- ⚡ Instant load times  
- 🎨 Utility-first styling with Tailwind CSS  
- 🚀 Production deployment via Vercel  

---

## 🧠 Design Philosophy

StoryCrafter was built with three guiding principles:

### 1. Local-first, writer-first
Writers shouldn’t need an account, an internet connection, or a database migration to start writing. All data is stored locally using `localStorage`, making the app fast, private, and offline-ready.

### 2. State is the source of truth
Navigation, selection, and UI rendering are driven entirely by application state — not URLs, not DOM hacks, not implicit side effects.

### 3. Explicit over magical
Every action (add, update, delete, navigate) is represented as an explicit function in a centralized store. No hidden mutations. No surprises.

---

## 🏗️ Architecture Overview

### Tech Stack

| Layer | Choice | Reason |
|------|-------|--------|
| Frontend Framework | React | Component-driven UI, predictable rendering |
| Build Tool | Vite | Fast dev server, optimized production builds |
| State Management | Zustand | Minimal, unopinionated, no boilerplate |
| Persistence | localStorage (zustand/persist) | Offline-first, zero backend |
| Styling | Tailwind CSS v4 | Utility-first, scalable styling |
| Deployment | Vercel | SPA-friendly, zero-config hosting |

---

## 🧩 Application Structure

```txt
src/
├── components/        # Reusable UI components
├── views/             # Page-level views
├── store/
│   └── useStoryCrafterStore.js  # Global state + actions
├── styles/
│   └── index.css      # Tailwind entry point
├── App.jsx            # View resolver
└── main.jsx           # App bootstrap
```

## State Management (Zustand)

StoryCrafter uses a single global store to manage:
### Core navigation state
```
currentView
selectedStory
selectedChapter
selectedCharacter
```
This replaces traditional routing. The UI is a pure function of state.

### Domain Data

```
stories
chapters
characters
worldMaps
chapterHistory
```
Each data structure is scoped by `storyId`.

###  Actions
All mutations are performed through explicit actions:
* addStory
* updateStory
* deleteStory
* addCharacter
* deleteCharacter
* addChapter
* saveChapterVersion

This ensures predictable updates and easy debugging.

## 💾 Persistence Strategy
Persistence is handled using Zustand middleware:

```
persist(
  (set, get) => ({ ... }),
  { name: "storycrafter-storage" }
)
```

### Why localStorage?
* Zero backend complexity
* Instant reads/writes
* Survives page reloads
* Ideal for personal creative tools
#### Accepted Tradeoffs
* No cross-device sync
* Browser storage limits
* Single-user scope


## 🧭 Navigation Model (Why No React Router)

StoryCrafter intentionally does not use URL-based routing.

### Rationale
* Navigation depends on selected entities, not URLs
* URLs add unnecessary coupling
* State-driven views are simpler and more reliable

### View Resolution
```
switch (currentView) {
  case "landing":
  case "story-detail":
  case "character-detail":
  case "chapter-editor":
}
```

## 🎨 Styling with Tailwind CSS
### Why Tailwind?
* No cascading surprises
* Styles live next to components
* Rapid iteration
* Consistent spacing and typography

Example:
```
<button className="px-4 py-2 bg-gray-900 text-white rounded-xl">
  Create Story
</button>
```

## ⚠️ Intentional Design Decisions
### ❌ No backend

Deliberate choice. This is a personal creative workspace, not a SaaS platform.

### ❌ No authentication

Local data, private usage, zero friction.

### ❌ No URL routing

State-driven navigation is simpler and safer for this scope.

## 🚀 Deployment (Vercel)
Build Command:
```
npm run build
```
Output Directory:
```
dist/
```
### SPA Routing Configuration

A vercel.json file ensures correct asset handling and SPA fallback:
```
{
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```
## 🧪 Development
```
npm install
npm run dev
```

Runs locally at: `http://localhost:5173`

## 🧯 Error Handling Philosophy

* Defensive state updates
* Null-safe selections
* Graceful fallback views
* No silent failures
* Errors surface clearly and are easy to debug.

## 🧱 Future Enhancements

* Export/import story data (JSON)
* Markdown-based chapter editor
* World map visualization
* Optional cloud sync
* Chapter version diff viewer

## 🏁 Final Notes

StoryCrafter is not a demo.
It is not a toy.
It is a deliberately designed system with clear architectural intent.

Every choice — from Zustand to localStorage to state-driven navigation — exists to support one goal:

> **Let writers write without fighting the tool.**

-----------
Author: Bhargavi Kurukunda
