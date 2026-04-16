const DAY_MS = 24 * 60 * 60 * 1000;

function pad(value: number): string {
	return String(value).padStart(2, '0');
}

export function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
	const next = new Date(date);
	next.setDate(next.getDate() + days);
	return next;
}

export function diffCalendarDays(later: Date, earlier: Date): number {
	return Math.round((startOfDay(later).getTime() - startOfDay(earlier).getTime()) / DAY_MS);
}

export function toDayKey(date: Date): string {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toMonthKey(date: Date): string {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function toYearKey(date: Date): string {
	return String(date.getFullYear());
}

export function parseDayKey(key: string): Date {
	const [year, month, day] = key.split('-').map(Number);
	return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function parseMonthKey(key: string): Date {
	const [year, month] = key.split('-').map(Number);
	return new Date(year, (month ?? 1) - 1, 1);
}

export function formatTimerLabel(date: Date | null, now = new Date()): string {
	if (!date) return 'No logs yet';
	const deltaMs = Math.max(0, now.getTime() - date.getTime());
	const hours = Math.floor(deltaMs / (60 * 60 * 1000));
	const minutes = Math.floor((deltaMs % (60 * 60 * 1000)) / (60 * 1000));
	return `${hours}h ${minutes}m since last smoke`;
}

export function formatTimerClock(date: Date | null, now = new Date()): string {
	if (!date) return '--:--:--';
	const deltaMs = Math.max(0, now.getTime() - date.getTime());
	const totalSeconds = Math.floor(deltaMs / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function formatDurationClock(durationMs: number | null): string {
	if (durationMs === null) return '--:--:--';
	const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function formatHudLastSmoke(date: Date | null, now = new Date()): string {
	if (!date) return 'none yet';
	const deltaMs = Math.max(0, now.getTime() - date.getTime());
	const hours = Math.floor(deltaMs / (60 * 60 * 1000));
	const minutes = Math.floor((deltaMs % (60 * 60 * 1000)) / (60 * 1000));
	return `${hours}h ${minutes}m`;
}

export function formatDayLabel(date: Date): string {
	return date.toLocaleDateString([], {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
	});
}

export function formatMonthLabel(date: Date): string {
	return date.toLocaleDateString([], {
		month: 'short',
		year: '2-digit',
	});
}

export function formatLongDate(date: Date): string {
	return date.toLocaleDateString([], {
		day: 'numeric',
		month: 'numeric',
		year: 'numeric',
	});
}

export function formatTime(date: Date): string {
	return date.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
	});
}

export function toDateInputValue(date: Date): string {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toTimeInputValue(date: Date): string {
	return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function combineDateAndTime(dateValue: string, timeValue: string): Date {
	const [year, month, day] = dateValue.split('-').map(Number);
	const [hours, minutes] = timeValue.split(':').map(Number);
	return new Date(year, (month ?? 1) - 1, day ?? 1, hours ?? 0, minutes ?? 0, 0, 0);
}

const CURRENCY_BY_COUNTRY: Record<string, string> = {
	AU: 'AUD',
	BR: 'BRL',
	CA: 'CAD',
	CH: 'CHF',
	CN: 'CNY',
	DE: 'EUR',
	ES: 'EUR',
	FR: 'EUR',
	GB: 'GBP',
	IE: 'EUR',
	IN: 'INR',
	IT: 'EUR',
	JP: 'JPY',
	MX: 'MXN',
	NL: 'EUR',
	PT: 'EUR',
	SE: 'SEK',
	US: 'USD',
};

export function currencyForCountry(country: string): string {
	return CURRENCY_BY_COUNTRY[country.toUpperCase()] ?? 'USD';
}

export function formatCurrency(amount: number, country: string): string {
	const currency = currencyForCountry(country);
	return new Intl.NumberFormat([], {
		style: 'currency',
		currency,
		maximumFractionDigits: 2,
	}).format(amount);
}
