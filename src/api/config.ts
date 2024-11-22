export const defaultConfig = {
  enableCache: true,
  cacheExpirationTime: 5 * 60 * 1000, // Default: 5 minutes
  enableRetry: true,
  retries: 3,
  retryDelay: 1000, // Default: 1 second
  timeout: 30000,  // Timeout after 30 seconds
};
