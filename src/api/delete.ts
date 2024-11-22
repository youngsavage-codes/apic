import { buildHeaders } from './headers';
import { defaultConfig } from './config';
import { withRetry } from './retry';

export async function deleteData(
  url: string,
  authToken?: string,
  config: Partial<typeof defaultConfig> = {},
  timeout: number = 5000 // Default timeout: 5 seconds
): Promise<any> {
  const finalConfig = { ...defaultConfig, ...config };

  const operation = async (): Promise<any> => {
    const responseOrError = await Promise.race([
      fetch(url, {
        method: 'DELETE',
        headers: buildHeaders('application/json', authToken),
      }),
      new Promise<Error>((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout)
      ),
    ]);

    if (responseOrError instanceof Error) {
      throw responseOrError; // Timeout or other error
    }

    const response = responseOrError as Response;
    if (!response.ok) throw new Error(`Failed to delete: ${response.status}`);
    return response.json();
  };

  return finalConfig.enableRetry
    ? withRetry(operation, finalConfig.retries, finalConfig.retryDelay)
    : operation();
}
