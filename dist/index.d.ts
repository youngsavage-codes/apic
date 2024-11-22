import { defaultConfig } from "./api/config";
declare class Apic {
    config: typeof defaultConfig;
    constructor(config?: Partial<typeof defaultConfig>);
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
}
export default Apic;
