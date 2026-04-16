import { Timestamp } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { TERMINAL_RETENTION_MS } from '../config';
import type { GoogleLinkSessionStatus } from '../domain/types';
import { db } from '../lib/firebase';
import { isTerminalStatus } from '../services/sessions';
import '../config';

export const cleanupGoogleLinkSessions = onSchedule('every 60 minutes', async () => {
	const now = new Date();
	const expiredSnapshot = await db.collection('googleLinkSessions').where('expiresAt', '<=', now).get();

	let expiredCount = 0;
	for (let index = 0; index < expiredSnapshot.docs.length; index += 200) {
		const batch = db.batch();
		let batchTouched = false;
		for (const docSnapshot of expiredSnapshot.docs.slice(index, index + 200)) {
			const status = String(docSnapshot.get('status') ?? 'pending') as GoogleLinkSessionStatus;
			if (status === 'pending' || status === 'authorized' || status === 'migrating' || status === 'ready_to_switch') {
				batch.set(
					docSnapshot.ref,
					{
						status: 'expired',
						errorCode: 'session-expired',
						errorMessage: 'This Google link session expired before it was finished.',
						updatedAt: Timestamp.now(),
					},
					{ merge: true },
				);
				batchTouched = true;
				expiredCount += 1;
			}
		}
		if (batchTouched) {
			await batch.commit();
		}
	}

	const terminalCutoff = Timestamp.fromDate(new Date(now.getTime() - TERMINAL_RETENTION_MS));
	const staleSnapshot = await db.collection('googleLinkSessions').where('updatedAt', '<=', terminalCutoff).get();

	let deletedCount = 0;
	for (let index = 0; index < staleSnapshot.docs.length; index += 200) {
		const batch = db.batch();
		let batchTouched = false;
		for (const docSnapshot of staleSnapshot.docs.slice(index, index + 200)) {
			const status = String(docSnapshot.get('status') ?? 'pending') as GoogleLinkSessionStatus;
			if (isTerminalStatus(status)) {
				batch.delete(docSnapshot.ref);
				batchTouched = true;
				deletedCount += 1;
			}
		}
		if (batchTouched) {
			await batch.commit();
		}
	}

	logger.info('google-link cleanup finished', { expiredCount, deletedCount });
});
