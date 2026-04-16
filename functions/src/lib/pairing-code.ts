import { createHash, randomBytes } from 'node:crypto';
import { CODE_ALPHABET } from '../config';

export function normalizePairingCode(input: string): string {
	return input.toUpperCase().replace(/[^A-Z2-9]/g, '').slice(0, 10);
}

export function hashPairingCode(code: string): string {
	return createHash('sha256').update(normalizePairingCode(code)).digest('hex');
}

function randomCodeChars(length: number): string {
	const bytes = randomBytes(length);
	let value = '';
	for (let index = 0; index < length; index += 1) {
		value += CODE_ALPHABET[bytes[index]! % CODE_ALPHABET.length]!;
	}
	return value;
}

export function generatePairingCode(): string {
	const raw = randomCodeChars(10);
	return `${raw.slice(0, 5)}-${raw.slice(5)}`;
}
