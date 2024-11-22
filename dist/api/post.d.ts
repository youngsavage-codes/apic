import { defaultConfig } from './config';
export declare function postData(url: string, body: any, authToken?: string, contentType?: string, config?: Partial<typeof defaultConfig>, timeout?: number): Promise<any>;
