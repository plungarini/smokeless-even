# Smokeless

Smokeless is an Even Hub app for tracking cigarettes, running a quit program, and showing a glanceable HUD on Even Realities G2 glasses.

## What It Includes

- Firebase anonymous auth with automatic Even account linking
- Optional Google account linking via Firebase Auth redirect
- Firestore-backed `users` documents with a single `logs` subcollection owned by the canonical Firebase Auth UID
- Onboarding for baseline smoking data and quit-program setup
- Home, statistics, history, and program/settings web views
- A direct-SDK HUD with glance, confirm-log, and daily-summary states
- Client-side account linking and merge into the canonical Firebase-auth account

## Setup

### 1. Install dependencies

```bash
cd apps/smokeless
npm install
```

### 2. Configure the web app

Copy `.env.example` to `.env` and fill in the Firebase client config.

### 3. Run the app

```bash
cd apps/smokeless
npm run dev
```

### 4. Open on glasses

```bash
npm run qr
```

## Data Model

The app writes the following Firestore structure:

```text
users/{uid}
users/{uid}/logs/{logId}
```

The `uid` is the canonical Firebase Auth UID for the active account. The user document is nested and iOS-aligned, with:

- `preferences`
- `onboarding`
- `providers.google`
- `providers.even`
- `longestEverCessation`
- `todayMaxCessation`

If Google is linked later:

- a brand-new Google identity upgrades the current account in place
- an existing Google-linked Firebase account becomes the canonical account, and Smokeless merges the anonymous data into it
- provider metadata is stored under `providers.google`

## Notes

- Smoke events are stored only in `users/{uid}/logs`, with each log containing `timestamp` and `intervalSincePrevious`.
- Stats, history, and latest-smoke data are derived from logs at read time; there is no `stats` subcollection and no soft-delete tombstones.
- Firestore security rules should grant users access only to `users/{request.auth.uid}` and `users/{request.auth.uid}/logs/*`.
- Google sign-in must be enabled in Firebase Auth, and your app host must be listed in Firebase authorized domains.
