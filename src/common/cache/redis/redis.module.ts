import { redisStore } from 'cache-manager-redis-store';
import * as dotenv from 'dotenv';
import { CacheModule } from '@nestjs/cache-manager';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { RedisManager } from './redis.manager';

dotenv.config();

@Global()
@Module({})
export class RedisModule {
  static register(): DynamicModule {
    return {
      module: RedisModule,
      imports: [
        CacheModule.registerAsync({
          useFactory: () => {
            return {
              config: {
                store: redisStore,
                host: process.env.REDIS_HOST ?? 'localhost',
                port: parseInt(process.env.CACHE_PORT ?? '6379'),
              },
            };
          },
        }),
      ],
      providers: [RedisManager],
      exports: [CacheModule, RedisManager],
    };
  }
}
