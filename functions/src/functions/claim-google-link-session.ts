import { FieldValue } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { assertString } from '../lib/errors';
import { adminAuth } from '../lib/firebase';
import { sessionRef } from '../repositories/refs';
import '../config';

export const claimGoogleLinkSession = onCall(async (request) => {
	const requestUid = request.auth?.uid;
	if (!requestUid) {
		throw new HttpsError('unauthenticated', 'You must be signed in to switch onto the linked Google account.');
	}

	const sessionId = assertString(request.data?.sessionId, 'sessionId');
	const sessionSnapshot = await sessionRef(sessionId).get();
	if (!sessionSnapshot.exists) {
		throw new HttpsError('not-found', 'Google link session not found.');
	}

	const session = sessionSnapshot.data() ?? {};
	const status = String(session.status ?? 'pending');
	const sourceUid = String(session.sourceUid ?? '');
	const targetUid = String(session.targetGoogleUid ?? '');
	const targetGoogleEmail = String(session.targetGoogleEmail ?? '');
	const targetGoogleDisplayName = String(session.targetGoogleDisplayName ?? '');

	if (requestUid !== sourceUid) {
		throw new HttpsError('permission-denied', 'Only the original Smokeless session can claim this Google link.');
	}

	if (status !== 'ready_to_switch' && status !== 'switched' && status !== 'consumed') {
		throw new HttpsError('failed-precondition', `Session is ${status}.`);
	}

	if (!targetUid) {
		throw new HttpsError('failed-precondition', 'This Google link session is missing its target account.');
	}

	let customToken = '';
	try {
		customToken = await adminAuth.createCustomToken(targetUid);
	} catch (error) {
		await sessionRef(sessionId).set(
			{
				status: 'ready_to_switch',
				errorCode: 'custom-token-mint-failed',
				errorMessage:
					error instanceof Error
						? error.message
						: 'Could not mint a Firebase custom token for the linked Google account.',
				switchErrorAt: FieldValue.serverTimestamp(),
				updatedAt: FieldValue.serverTimestamp(),
			},
			{ merge: true },
		);

		logger.error('custom-token-mint-failed', {
			sessionId,
			sourceUid,
			targetUid,
			error,
		});

		throw new HttpsError(
			'internal',
			'Could not mint a custom token for the linked Google account. Check Firebase IAM for signBlob permission.',
		);
	}

	if (status === 'ready_to_switch') {
		await sessionRef(sessionId).set(
			{
				status: 'switched',
				switchClaimedAt: FieldValue.serverTimestamp(),
				updatedAt: FieldValue.serverTimestamp(),
				errorCode: null,
				errorMessage: null,
			},
			{ merge: true },
		);
	}

	logger.info('google link claimed by source app', {
		sessionId,
		sourceUid,
		targetUid,
		status,
	});

	return {
		status: (status === 'consumed' ? 'consumed' : 'switched') as 'switched' | 'consumed',
		customToken,
		targetUid,
		account: {
			uid: targetUid,
			authProvider: 'google' as const,
			googleEmail: targetGoogleEmail,
			googleDisplayName: targetGoogleDisplayName,
			isAnonymous: false,
		},
	};
});
