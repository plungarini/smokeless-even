# Smokeless

Smokeless is an Even Hub app for tracking cigarettes, running a quit program, and showing a glanceable HUD on Even Realities G2 glasses.

## What It Includes

- Firebase anonymous auth with automatic Even account linking
- Cross-device Google account linking via pairing codes, Firebase Functions, and a dedicated GitHub Pages linker site
- Firestore-backed `users` documents with a single `logs` subcollection owned by the canonical Firebase Auth UID
- Onboarding for baseline smoking data and quit-program setup
- Home, statistics, history, and program/settings web views
- A direct-SDK HUD with glance, confirm-log, and daily-summary states
- Server-side account merge into the canonical Google-backed Firebase account

## Setup

### 1. Install dependencies

```bash
cd apps/smokeless
npm install
npm --prefix functions install
```

### 2. Configure the web app

Copy `.env.example` to `.env` and fill in the Firebase client config:

- `VITE_FIREBASE_*`
- `VITE_FIREBASE_FUNCTIONS_REGION`
- `VITE_GOOGLE_LINK_URL`

Copy `functions/.env.example` to `functions/.env` and set:

- `GOOGLE_LINK_URL`

### 3. Run the app

```bash
cd apps/smokeless
npm run dev
```

### 4. Optional: run the Google linker site locally

```bash
npm run dev:link-site
```

### 5. Open on glasses

```bash
npm run qr
```

### 6. Deploy backend and rules

```bash
firebase deploy --only functions,firestore:rules --project <your-firebase-project-id>
```

### 7. GitHub Pages linker deployment

The repo includes `.github/workflows/deploy-link-site.yml`, which builds and deploys the dedicated linker site from `develop`.

Configure these repository secrets before enabling the workflow:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_FUNCTIONS_REGION`

## Data Model

The app writes the following Firestore structure:

```text
users/{uid}
users/{uid}/logs/{logId}
googleLinkSessions/{sessionId}
```

The `uid` is the canonical Firebase Auth UID for the active account. The user document is nested and iOS-aligned, with:

- `preferences`
- `onboarding`
- `providers.google`
- `providers.even`
- `longestEverCessation`
- `todayMaxCessation`

If Google is linked later:

- the app creates a 15-minute pairing code tied to the current anonymous Firebase UID
- the user completes Google auth on the GitHub Pages linker site
- Firebase Functions merge the anonymous data into the Google-backed Firebase UID
- the Even app switches onto that canonical Google UID with a Firebase custom token
- provider metadata is stored under `providers.google`

## Notes

- Smoke events are stored only in `users/{uid}/logs`, with each log containing `timestamp` and `intervalSincePrevious`.
- Stats, history, and latest-smoke data are derived from logs at read time; there is no `stats` subcollection and no soft-delete tombstones.
- Firestore security rules live in `firestore.rules`. Users can access only their own `users/{uid}` data and can read only their own `googleLinkSessions/{sessionId}` documents.
- Google sign-in must be enabled in Firebase Auth, and only the GitHub Pages linker origin needs to be listed in Firebase authorized domains.
- The main Even app no longer uses Firebase Auth redirect linking inside the Even WebView.
