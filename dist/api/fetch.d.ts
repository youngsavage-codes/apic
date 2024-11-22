import { defaultConfig } from './config';
export declare function fetchData(url: string, authToken?: string, config?: Partial<typeof defaultConfig>, headers?: Record<string, string>, // Accept custom headers here
timeout?: number): Promise<any>;
