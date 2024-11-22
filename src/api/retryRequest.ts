import { fetchData } from './fetch';
import { postData } from './post';
import { putOrPatchData } from './putOrPatch';
import { deleteData } from './delete';
import { defaultConfig } from './config';
import { withRetry } from './retry';

export async function retryRequest(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  body?: any,
  authToken?: string,
  contentType: string = 'application/json',
  config: Partial<typeof defaultConfig> = {}
): Promise<any> {
  const finalConfig = { ...defaultConfig, ...config };

  const operation = async (): Promise<any> => {
    switch (method) {
      case 'GET':
        return fetchData(url, authToken, config);
      case 'POST':
        return postData(url, body, authToken, contentType, config);
      case 'PUT':
      case 'PATCH':
        return putOrPatchData(method, url, body, authToken, contentType, config);
      case 'DELETE':
        return deleteData(url, authToken, config);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  };

  return finalConfig.enableRetry
    ? withRetry(operation, finalConfig.retries, finalConfig.retryDelay, finalConfig.retries)
    : operation();
}
