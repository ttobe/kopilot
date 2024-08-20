import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { setupHandlebars } from './common/config/handlebars';

async function bootstrap() {
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);

  const root: string = join(__dirname, '..');
  app.useStaticAssets(join(root, 'views'));
  app.setBaseViewsDir(join(root, 'views'));

  setupHandlebars(app, root);

  await app.listen(3000);
}

bootstrap();
