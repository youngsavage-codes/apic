import { defaultConfig } from "./api/config";
declare class Apic {
    config: typeof defaultConfig;
    private headers;
    constructor(config?: Partial<typeof defaultConfig>);
    setHeaders(headers: Record<string, string>): void;
    get(url: string, authToken?: string): Promise<any>;
    post(url: string, body: any, authToken?: string, contentType?: string): Promise<any>;
    put(url: string, body: any, authToken?: string, contentType?: string): Promise<any>;
    patch(url: string, body: any, authToken?: string, contentType?: string): Promise<any>;
    delete(url: string, authToken?: string): Promise<any>;
    setConfig(config: Partial<typeof defaultConfig>): void;
    getConfig(): typeof defaultConfig;
    getCache(): Map<string, {
        data: any;
        timestamp: number;
    }>;
    clearCache(url?: string): void;
}
export default Apic;
