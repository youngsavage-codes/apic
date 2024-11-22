import { buildHeaders } from './headers';
import { cache } from './cache';
import { defaultConfig } from './config';
import { withRetry } from './retry';

export async function fetchData(
  url: string,
  authToken?: string,
  config: Partial<typeof defaultConfig> = {},
  timeout: number = 5000 // Default timeout: 5 seconds
): Promise<any> {
  const finalConfig = { ...defaultConfig, ...config };

  const operation = async (): Promise<any> => {
    if (finalConfig.enableCache) {
      const cachedData = cache.get(url);
      if (cachedData && Date.now() - cachedData.timestamp < finalConfig.cacheExpirationTime) {
        console.log('Returning cached data');
        return cachedData.data;
      }
    }

    const responseOrError = await Promise.race([
      fetch(url, {
        method: 'GET',
        headers: buildHeaders('application/json', authToken),
      }),
      new Promise<Error>((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout)
      ),
    ]);

    if (responseOrError instanceof Error) {
      throw responseOrError; // Timeout or other error
    }

    // Now we can safely access Response properties
    const response = responseOrError as Response;
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const data = await response.json();
    if (finalConfig.enableCache) cache.set(url, { data, timestamp: Date.now() });

    return data;
  };

  // Track retries using withRetry function
  return finalConfig.enableRetry
    ? withRetry(operation, finalConfig.retries, finalConfig.retryDelay)
    : operation();
}
