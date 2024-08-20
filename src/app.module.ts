import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClovaModule } from './clova/clova.module';
import { RedisModule } from './common/cache/redis/redis.module';
import { SpellModule } from './spell/spell.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SpellModule,
    ClovaModule,
    RedisModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
