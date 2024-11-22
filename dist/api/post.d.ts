import { defaultConfig } from './config';
export declare function postData(url: string, body: any, authToken?: string, contentType?: string, config?: Partial<typeof defaultConfig>, headers?: Record<string, string>, // Accept custom headers here
timeout?: number): Promise<any>;
