import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateUser(payload: any): Promise<any> {
    // TODO: 유효성 검사 및 사용자 로직 추가
    return payload;
  }
}
