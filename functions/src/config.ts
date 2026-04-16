import dotenv from 'dotenv';
import { setGlobalOptions } from 'firebase-functions/v2';

dotenv.config();

export const FUNCTIONS_REGION = process.env.FUNCTIONS_REGION ?? 'europe-west1';
export const GOOGLE_LINK_URL = process.env.GOOGLE_LINK_URL ?? 'https://plungarini.github.io/smokeless-even/';
export const GOOGLE_PROVIDER_ID = 'google.com';
export const SESSION_TTL_MS = 15 * 60 * 1000;
export const TERMINAL_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
export const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

setGlobalOptions({ region: FUNCTIONS_REGION });
