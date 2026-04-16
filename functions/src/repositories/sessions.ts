import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../lib/firebase';
import type { GoogleLinkSessionStatus } from '../domain/types';

export async function invalidateOpenSessions(sourceUid: string): Promise<void> {
	const snapshot = await db.collection('googleLinkSessions').where('sourceUid', '==', sourceUid).get();
	const openSessions = snapshot.docs.filter((docSnapshot) => {
		const status = String(docSnapshot.get('status') ?? '') as GoogleLinkSessionStatus;
		return status === 'pending' || status === 'authorized';
	});

	if (openSessions.length === 0) return;

	const batch = db.batch();
	for (const docSnapshot of openSessions) {
		batch.set(
			docSnapshot.ref,
			{
				status: 'cancelled',
				errorCode: 'replaced-by-new-session',
				errorMessage: 'Superseded by a newer pairing request.',
				updatedAt: FieldValue.serverTimestamp(),
			},
			{ merge: true },
		);
	}
	await batch.commit();
}
