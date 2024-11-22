import { defaultConfig } from './config';
export declare function retryRequest(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', url: string, body?: any, authToken?: string, contentType?: string, config?: Partial<typeof defaultConfig>): Promise<any>;
