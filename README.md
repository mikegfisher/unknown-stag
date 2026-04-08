# Asyncast

Asyncast is a real-time planning poker app for async teams. Collaborators create voting sessions, add issues to estimate, and reveal story points together — no matter where everyone is working from.

### What is planning poker?

Planning poker is a technique for estimating the level of effort for tasks or user stories. The session owner adds issues, team members vote secretly using Fibonacci-scale point values (1, 2, 3, 5, 8, 13, 21), and when the owner reveals votes everyone sees the results along with the rounded average. This helps teams align on estimates without anchoring bias.

### How points work

Points measure level of effort, not time. Like miles on a road trip — the same distance can take very different amounts of time depending on conditions — points represent relative complexity. Once a team calibrates their velocity, points become a reliable planning tool.

## Live URLs
- https://asyncast-6b51e.web.app/dashboard

## Setup

### Prerequisites
- [Node.js](https://nodejs.org) v18+
- A [Firebase](https://firebase.google.com) project with **Authentication** (Google provider), **Firestore**, and **Hosting** enabled

### Local development

1. Clone the repo
   ```bash
   git clone https://github.com/mikegfisher/unknown-stag.git
   cd unknown-stag
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure Firebase

   Copy the Firebase config object from your Firebase project console (Project Settings → Your apps → SDK setup) and create `src/lib/firebase.ts`:
   ```ts
   import { initializeApp } from 'firebase/app'
   import { getAuth } from 'firebase/auth'
   import { getFirestore } from 'firebase/firestore'

   const firebaseConfig = {
     apiKey: '...',
     authDomain: '...',
     projectId: '...',
     storageBucket: '...',
     messagingSenderId: '...',
     appId: '...',
   }

   const app = initializeApp(firebaseConfig)
   export const auth = getAuth(app)
   export const db = getFirestore(app)
   ```

   > **Note:** `localhost` is not an authorized domain for the production Firebase project. You must configure your own Firebase project for local development.

4. Start the dev server
   ```bash
   npm run dev
   ```

### Deploy to Firebase Hosting

```bash
npm run build
npx firebase deploy --only hosting
```

The app is configured to deploy the `dist/` folder to Firebase Hosting with SPA rewrites so all routes resolve to `index.html`.
