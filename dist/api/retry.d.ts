export declare function withRetry(operation: () => Promise<any>, retries: number, delay: number, refreshLimit?: number): Promise<any>;
