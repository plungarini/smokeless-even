import dotenv from 'dotenv';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

dotenv.config();

initializeApp({
	serviceAccountId: process.env.FUNCTIONS_SERVICE_ID,
});

export const db = getFirestore();
export const adminAuth = getAuth();
