import { Strategy } from 'passport-naver';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.NAVER_CLIENT_ID, // 네이버 클라이언트 ID
      clientSecret: process.env.NAVER_CLIENT_SECRET, // 네이버 클라이언트 시크릿
      callbackURL: process.env.NAVER_CALLBACK_URL, // 콜백 URL
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    const { id, displayName, emails } = profile;

    const user = {
      naverId: id,
      accessToken,
    };

    // TODO: 사용자 정보를 데이터베이스에 저장하거나, 세션? 토큰?
    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}
