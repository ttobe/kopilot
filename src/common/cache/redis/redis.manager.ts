import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CacheManager } from '../cache.manager';

@Injectable()
export class RedisManager implements CacheManager {
  private readonly CACHE_TTL: number =
    parseInt(process.env.CACHE_HOUR ?? '0') * 1000 * 60 * 60;

  constructor(
    @Inject(CACHE_MANAGER)
    readonly cacheManager: Cache,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number): void {
    this.cacheManager.set(key, value, ttl ?? this.CACHE_TTL);
  }
}
