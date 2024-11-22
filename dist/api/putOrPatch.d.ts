import { defaultConfig } from './config';
export declare function putOrPatchData(method: 'PUT' | 'PATCH', url: string, body: any, authToken?: string, contentType?: string, config?: Partial<typeof defaultConfig>, headers?: Record<string, string>, // Add custom headers
timeout?: number): Promise<any>;
