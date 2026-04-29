# Smokeless

**A cigarette tracker and quit companion for Even Realities Glasses glasses.**

Smokeless lets you log cigarettes, monitor your smoking patterns, and track your progress toward quitting — all from your glasses. A quick tap on the frame records a smoke instantly, while the companion phone UI gives you rich stats, history, and settings.

## What It Does

Smokeless is built for smokers who want to cut down or quit. It replaces mental tallying with a frictionless, always-available log. Every cigarette is timestamped so you can see exactly how long it has been since your last one, view daily and long-term trends, and celebrate your longest smoke-free stretches.

Because it runs on G2 glasses, you can log a cigarette the moment you finish it — no need to unlock your phone or open an app.

## Key Features

- **Instant Glass Logging** — Single-tap the glasses frame to record a cigarette. Double-tap opens the HUD menu.
- **Live Cessation Timer** — A real-time clock shows how long it has been since your last smoke, right on the glasses display.
- **Cessation Records** — Tracks today's longest smoke-free period and your all-time personal best.
- **Rich Statistics** — Weighted daily averages, week/month/year breakdowns, and trend comparisons on the phone UI.
- **History Calendar** — Browse any day, add backdated entries, or delete mistakes.
- **Two Sync Modes**
  - _Local_: Data stays on the device via Bridge Local Storage. No account needed.
  - _Google_: Cross-device sync via Firebase Auth and Firestore. Secure pairing-code handoff lets you link from your phone browser without typing passwords inside the Even WebView.
- **Discreet & Fast** — Optimised for the 576 × 288 px 4-bit greyscale G2 display; the HUD is glanceable and distraction-free.

## How It Works / User Flow

1. **Onboarding** — On first launch, choose _Local_ (device-only) or _Google_ (cloud sync). Google sign-in uses a temporary pairing code and a secure external linker page, so you never enter credentials inside the WebView.
2. **Home** — The glasses HUD shows today's count and a live timer since your last cigarette. The phone WebView mirrors this with larger visuals and your longest cessation records.
3. **Log a Smoke** — Tap the glasses frame once. The HUD briefly confirms the log, then returns to the timer. You can also log from the phone UI or add a past entry via History.
4. **Menu** — Double-tap the frame to open the glasses menu, then scroll and click to switch between Home, Stats, and History views.
5. **Stats & History** — Open these on the phone for detailed charts, calendar browsing, and data export.

## Tech Stack

| Layer          | Tech                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------- |
| Glasses HUD    | `@evenrealities/even_hub_sdk`, `@evenrealities/pretext`, pure TypeScript                 |
| Phone UI       | React 19, Vite, TypeScript, Tailwind CSS v4, `even-toolkit`                              |
| State          | Shared `AppStore` singleton (no framework); Bridge Local Storage for durable persistence |
| Backend        | Firebase Auth, Firestore, Cloud Functions                                                |
| Image encoding | `upng-js`                                                                                |
| Dev tools      | `@evenrealities/evenhub-cli`, `@evenrealities/evenhub-simulator`                         |

## Getting Started

```bash
cd apps/smokeless
npm install
npm --prefix functions install

# Copy and fill in your Firebase config
cp .env.example .env
cp functions/.env.example functions/.env

# Start the dev server
npm run dev

# Generate a QR code to scan with the Even App
npm run qr

# Package for distribution
npm run pack
```

## Why Smokeless?

Most habit trackers live on your phone, which means friction, distraction, and forgotten logs. Smokeless puts the interaction on your glasses — the one place that is already with you when you step outside for a smoke. By making logging instant and invisible, it turns a chore into a reflex, giving you honest data and a clear picture of your habit so you can actually change it.

---

_Built for the Even Realities Glasses platform._
