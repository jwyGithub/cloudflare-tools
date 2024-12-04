import { FetchClient } from './src/fetch';

export * from './src/fetch';
export * from './src/fetchWithRetry';
export * from './src/fetchWithTimeout';
export * from './src/types';

export const fetch = new FetchClient();
