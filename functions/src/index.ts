import * as logger from 'firebase-functions/logger';
import { FUNCTIONS_REGION, GOOGLE_LINK_URL } from './config';

logger.info('smokeless functions configured', {
	region: FUNCTIONS_REGION,
	linkUrl: GOOGLE_LINK_URL,
});

export { createGoogleLinkSession } from './functions/create-google-link-session';
export { resolveGoogleLinkCode } from './functions/resolve-google-link-code';
export { completeGoogleLinkSession } from './functions/complete-google-link-session';
export { prepareGoogleLinkMigration } from './functions/prepare-google-link-migration';
export { claimGoogleLinkSession } from './functions/claim-google-link-session';
export { completeGoogleLinkCleanup } from './functions/complete-google-link-cleanup';
export { getGoogleLinkSessionStatus } from './functions/get-google-link-session-status';
export { cleanupGoogleLinkSessions } from './functions/cleanup-google-link-sessions';
