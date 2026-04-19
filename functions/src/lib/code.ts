import { createHash, randomBytes } from 'node:crypto';
import { CODE_ALPHABET, CODE_LENGTH } from '../config';

export function generateHandoffCode(): string {
	const bytes = randomBytes(CODE_LENGTH);
	let out = '';
	for (let i = 0; i < CODE_LENGTH; i += 1) {
		out += CODE_ALPHABET[bytes[i]! % CODE_ALPHABET.length];
	}
	return out;
}

export function generateSessionToken(): string {
	return randomBytes(32).toString('base64url');
}

export function hashSessionToken(token: string): string {
	return createHash('sha256').update(token).digest('hex');
}
