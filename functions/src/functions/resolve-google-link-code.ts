import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { db } from '../lib/firebase';
import { assertString } from '../lib/errors';
import { toDate } from '../lib/firestore-mappers';
import { hashPairingCode, normalizePairingCode } from '../lib/pairing-code';
import { assertActiveSession } from '../services/sessions';
import '../config';

export const resolveGoogleLinkCode = onCall(async (request) => {
	const normalizedCode = normalizePairingCode(assertString(request.data?.code, 'code'));
	if (normalizedCode.length !== 10) {
		throw new HttpsError('invalid-argument', 'Invalid pairing code format.');
	}

	const snapshot = await db.collection('googleLinkSessions').where('codeHash', '==', hashPairingCode(normalizedCode)).limit(1).get();
	if (snapshot.empty) {
		throw new HttpsError('not-found', 'Pairing code not found.');
	}

	const sessionSnapshot = snapshot.docs[0]!;
	const data = assertActiveSession(sessionSnapshot, ['pending', 'authorized']);
	const expiresAt = toDate(data.expiresAt);

	return {
		sessionId: sessionSnapshot.id,
		expiresAt: (expiresAt ?? new Date()).toISOString(),
	};
});
