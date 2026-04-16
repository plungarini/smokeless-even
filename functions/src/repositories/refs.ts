import { db } from '../lib/firebase';

export function newSessionRef() {
	return db.collection('googleLinkSessions').doc();
}

export function sessionRef(sessionId: string) {
	return db.collection('googleLinkSessions').doc(sessionId);
}

export function userRef(uid: string) {
	return db.collection('users').doc(uid);
}

export function logsRef(uid: string) {
	return userRef(uid).collection('logs');
}
