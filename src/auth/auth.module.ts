import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NaverStrategy } from './naver.strategy';

@Module({
  imports: [PassportModule],
  providers: [AuthService, NaverStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
