import * as Handlebars from 'express-handlebars';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

export function setupHandlebars(
  app: NestExpressApplication,
  root: string,
): void {
  app.setViewEngine('hbs');

  const handlebars = Handlebars.create({
    partialsDir: join(root, 'views/partials'),
    extname: '.hbs',
    helpers: {
      parseJson: (jsonString: string) =>
        JSON.parse(jsonString.replace(/\n|\r\n/g, '')),
    },
  });

  app.engine('hbs', handlebars.engine);
}
