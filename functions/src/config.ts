import dotenv from 'dotenv';
import { setGlobalOptions } from 'firebase-functions/v2';

dotenv.config();

export const FUNCTIONS_REGION = process.env.FUNCTIONS_REGION ?? 'europe-west1';
export const LINK_SITE_URL = process.env.LINK_SITE_URL ?? 'https://plungarini.github.io/smokeless-even/';

// Handoff codes live long enough for the user to finish Google sign-in on
// another device. 15 minutes matches common OTP windows.
export const HANDOFF_TTL_MS = 15 * 60 * 1000;

// Session tokens persist the user's Google-mode login across WebView
// restarts. 30-day rolling TTL — rotated on every exchange.
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const CODE_LENGTH = 8;

setGlobalOptions({ region: FUNCTIONS_REGION });
