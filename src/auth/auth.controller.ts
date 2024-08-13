import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('')
  @UseGuards(AuthGuard('naver'))
  async naverLogin(): Promise<any> {}

  @Get('callback')
  @UseGuards(AuthGuard('naver'))
  async naverLoginCallback(@Req() req, @Res() res): Promise<any> {
    // 로그인 성공 시 처리
    res.json(req.user);
  }
}
