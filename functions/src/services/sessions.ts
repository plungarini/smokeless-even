import { HttpsError } from 'firebase-functions/v2/https';
import type { DocumentData } from 'firebase-admin/firestore';
import type { GoogleLinkSessionStatus } from '../domain/types';
import { toDate } from '../lib/firestore-mappers';

export function isTerminalStatus(status: GoogleLinkSessionStatus): boolean {
	return status === 'consumed' || status === 'expired' || status === 'cancelled' || status === 'failed';
}

export function assertActiveSession(
	snap: FirebaseFirestore.DocumentSnapshot<DocumentData>,
	expectedStatuses: GoogleLinkSessionStatus[],
) {
	if (!snap.exists) {
		throw new HttpsError('not-found', 'Google link session not found.');
	}

	const data = snap.data() ?? {};
	const status = String(data.status ?? 'pending') as GoogleLinkSessionStatus;
	const expiresAt = toDate(data.expiresAt);

	if (expiresAt && expiresAt.getTime() <= Date.now() && !isTerminalStatus(status)) {
		throw new HttpsError('deadline-exceeded', 'This Google link session has expired.');
	}

	if (!expectedStatuses.includes(status)) {
		throw new HttpsError('failed-precondition', `Session is ${status}.`);
	}

	return data;
}
