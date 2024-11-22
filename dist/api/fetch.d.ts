import { defaultConfig } from './config';
export declare function fetchData(url: string, authToken?: string, config?: Partial<typeof defaultConfig>, timeout?: number): Promise<any>;
