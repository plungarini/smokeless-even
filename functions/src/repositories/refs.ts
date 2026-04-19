import { db } from '../lib/firebase';

export function userRef(uid: string) {
	return db.collection('users').doc(uid);
}

export function logsRef(uid: string) {
	return userRef(uid).collection('logs');
}

export function handoffCodeRef(code: string) {
	return db.collection('handoffCodes').doc(code);
}

export function googleSessionRef(firebaseUid: string) {
	return db.collection('googleSessions').doc(firebaseUid);
}
