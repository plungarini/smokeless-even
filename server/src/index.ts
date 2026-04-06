import { serve } from '@hono/node-server';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const required = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'] as const;

function getEnv(name: (typeof required)[number] | 'ALLOWED_ORIGIN' | 'PORT'): string {
	const value = process.env[name];
	if (!value && required.includes(name as (typeof required)[number])) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value ?? '';
}

function initializeFirebaseAdmin() {
	if (getApps().length > 0) {
		return getApps()[0];
	}

	return initializeApp({
		credential: cert({
			projectId: getEnv('FIREBASE_PROJECT_ID'),
			clientEmail: getEnv('FIREBASE_CLIENT_EMAIL'),
			privateKey: getEnv('FIREBASE_PRIVATE_KEY').replaceAll('\\n', '\n'),
		}),
	});
}

initializeFirebaseAdmin();

const app = new Hono();

app.use(
	'/auth/*',
	cors({
		origin: getEnv('ALLOWED_ORIGIN') || '*',
		allowMethods: ['POST', 'OPTIONS'],
		allowHeaders: ['Content-Type'],
	}),
);

app.post('/auth/token', async (c) => {
	const { uid } = await c.req.json<{ uid: string }>();
	const token = await getAuth().createCustomToken(uid);
	return c.json({ token });
});

app.get('/health', (c) => c.json({ ok: true }));

const port = Number.parseInt(getEnv('PORT') || '8787', 10);

serve(
	{
		fetch: app.fetch,
		port,
	},
	(info) => {
		console.log(`Smokeless auth server listening on http://localhost:${info.port}`);
	},
);
