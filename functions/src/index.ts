import * as logger from 'firebase-functions/logger';
import { FUNCTIONS_REGION, GOOGLE_LINK_URL } from './config';

logger.info('smokeless functions configured', {
	region: FUNCTIONS_REGION,
	linkUrl: GOOGLE_LINK_URL,
});

export { createGoogleLinkSession } from './functions/create-google-link-session';
export { resolveGoogleLinkCode } from './functions/resolve-google-link-code';
export { completeGoogleLinkSession } from './functions/complete-google-link-session';
export { getGoogleLinkSessionStatus } from './functions/get-google-link-session-status';
export { consumeGoogleLinkSession } from './functions/consume-google-link-session';
export { cleanupGoogleLinkSessions } from './functions/cleanup-google-link-sessions';
