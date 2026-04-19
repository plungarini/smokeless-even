import * as logger from 'firebase-functions/logger';
import { FUNCTIONS_REGION, LINK_SITE_URL } from './config';

logger.info('smokeless functions configured', {
	region: FUNCTIONS_REGION,
	linkUrl: LINK_SITE_URL,
});

export { createHandoffCode } from './functions/create-handoff-code';
export { authorizeHandoffCode } from './functions/authorize-handoff-code';
export { exchangeHandoffCode } from './functions/exchange-handoff-code';
export { exchangeGoogleSessionToken } from './functions/exchange-google-session-token';
