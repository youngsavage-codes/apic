// apic.ts

import { cache } from "./api/cache";
import { defaultConfig } from "./api/config";
import { deleteData } from "./api/delete";
import { fetchData } from "./api/fetch";
import { postData } from "./api/post";
import { putOrPatchData } from "./api/putOrPatch";

class Apic {
    public config: typeof defaultConfig;
  
    constructor(config: Partial<typeof defaultConfig> = {}) {
      this.config = { ...defaultConfig, ...config };
    }
  
    // GET request
    async get(url: string, authToken?: string): Promise<any> {
      return fetchData(url, authToken, this.config);
    }
  
    // POST request
    async post(
      url: string,
      body: any,
      authToken?: string,
      contentType: string = 'application/json'
    ): Promise<any> {
      return postData(url, body, authToken, contentType, this.config);
    }
  
    // PUT request
    async put(
      url: string,
      body: any,
      authToken?: string,
      contentType: string = 'application/json'
    ): Promise<any> {
      return putOrPatchData('PUT', url, body, authToken, contentType, this.config);
    }
  
    // PATCH request
    async patch(
      url: string,
      body: any,
      authToken?: string,
      contentType: string = 'application/json'
    ): Promise<any> {
      return putOrPatchData('PATCH', url, body, authToken, contentType, this.config);
    }
  
    // DELETE request
    async delete(url: string, authToken?: string): Promise<any> {
      return deleteData(url, authToken, this.config);
    }
  
    // Set or update configuration
    setConfig(config: Partial<typeof defaultConfig>): void {
      this.config = { ...this.config, ...config };
    }
  
    // Get current configuration
    getConfig(): typeof defaultConfig {
      return this.config;
    }
  
    // Access cache directly
    getCache(): Map<string, { data: any; timestamp: number }> {
      return cache;
    }
}
  
export default Apic;
