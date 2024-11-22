import { buildHeaders } from './headers';
import { defaultConfig } from './config';
import { withRetry } from './retry';

export async function putOrPatchData(
  method: 'PUT' | 'PATCH',
  url: string,
  body: any,
  authToken?: string,
  contentType: string = 'application/json',
  config: Partial<typeof defaultConfig> = {},
  timeout: number = 5000 // Default timeout: 5 seconds
): Promise<any> {
  const finalConfig = { ...defaultConfig, ...config };

  const operation = async (): Promise<any> => {
    const responseOrError = await Promise.race([
      fetch(url, {
        method,
        headers: buildHeaders(contentType, authToken),
        body: JSON.stringify(body),
      }),
      new Promise<Error>((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout)
      ),
    ]);

    if (responseOrError instanceof Error) {
      throw responseOrError; // Timeout or other error
    }

    const response = responseOrError as Response;
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return response.json();
  };

  return finalConfig.enableRetry
    ? withRetry(operation, finalConfig.retries, finalConfig.retryDelay)
    : operation();
}
