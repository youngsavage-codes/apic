import { defaultConfig } from './config';
export declare function deleteData(url: string, authToken?: string, config?: Partial<typeof defaultConfig>, headers?: Record<string, string>, // Add custom headers here
timeout?: number): Promise<any>;
