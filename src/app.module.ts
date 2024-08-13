import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpellModule } from './spell/spell.module';
import { ConfigModule } from '@nestjs/config';
import { ClovaModule } from './clova/clova.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), SpellModule, ClovaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
