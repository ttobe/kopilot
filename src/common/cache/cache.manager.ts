export interface CacheManager {
  get(key: string): Promise<string>;
  set(key: string, value: string, ttl?: number): void;
}
