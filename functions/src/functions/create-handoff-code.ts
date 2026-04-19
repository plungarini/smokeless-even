import { Timestamp } from 'firebase-admin/firestore';
import { onCall } from 'firebase-functions/v2/https';
import { HANDOFF_TTL_MS, LINK_SITE_URL } from '../config';
import { generateHandoffCode } from '../lib/code';
import { assertString } from '../lib/errors';
import { handoffCodeRef } from '../repositories/refs';
import '../config';

/**
 * Called by the WebView at the start of the Google sign-in flow. Creates
 * a short-lived `handoffCodes/{code}` doc that the link site stamps after
 * Google Sign-In completes; the WebView polls the same doc for the result.
 *
 * Callable without auth — the WebView has no Firebase user yet.
 */
export const createHandoffCode = onCall(async (request) => {
	const evenUid = assertString(request.data?.evenUid, 'evenUid');

	// Retry a few times on the astronomically rare code collision.
	for (let attempt = 0; attempt < 5; attempt += 1) {
		const code = generateHandoffCode();
		const ref = handoffCodeRef(code);
		const now = Date.now();
		const expiresAt = Timestamp.fromMillis(now + HANDOFF_TTL_MS);
		try {
			await ref.create({
				code,
				status: 'pending',
				evenUid,
				createdAt: Timestamp.fromMillis(now),
				expiresAt,
			});
			return {
				code,
				linkUrl: `${LINK_SITE_URL}?code=${encodeURIComponent(code)}`,
				expiresAt: expiresAt.toDate().toISOString(),
			};
		} catch (error) {
			// `create` throws ALREADY_EXISTS on collision — loop and retry.
			if (attempt === 4) throw error;
		}
	}
	throw new Error('Could not allocate handoff code.');
});
