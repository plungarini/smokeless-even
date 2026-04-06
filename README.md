# Smokeless

Smokeless is an Even Hub app for tracking cigarettes, running a quit program, and showing a glanceable HUD on Even Realities G2 glasses.

## What It Includes

- Firebase Auth via custom tokens where the Even UID is the Firebase UID
- Firestore-backed `users`, `smokes`, and `stats` collections matching the Smokeless schema
- Onboarding for baseline smoking data and quit-program setup
- Home, statistics, history, and program/settings web views
- A direct-SDK HUD with glance, confirm-log, and daily-summary states
- A minimal Hono auth service that mints Firebase custom tokens

## Setup

### 1. Install dependencies

```bash
cd apps/smokeless
npm install
npm --prefix server install
```

### 2. Configure the web app

Copy `.env.example` to `.env` and fill in the Firebase client config plus the auth server URL.

### 3. Configure the Hono auth server

Copy `server/.env.example` to `server/.env` and fill in the Firebase service-account values.

### 4. Run both services

```bash
cd apps/smokeless
npm run server:dev
npm run dev
```

### 5. Open on glasses

```bash
npm run qr
```

## Data Model

The app writes the following Firestore structure:

```text
users/{uid}
users/{uid}/smokes/{smokeId}
users/{uid}/stats/{period}
```

The `uid` is the Even UID and is also the Firebase Auth UID.
