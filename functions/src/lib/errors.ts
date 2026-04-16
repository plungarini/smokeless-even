import { HttpsError } from 'firebase-functions/v2/https';

export function assertString(value: unknown, fieldName: string): string {
	if (typeof value !== 'string' || !value.trim()) {
		throw new HttpsError('invalid-argument', `${fieldName} is required.`);
	}
	return value.trim();
}
