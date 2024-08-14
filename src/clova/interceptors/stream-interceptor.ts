import { Observable } from 'rxjs';
import { Readable, Transform, Writable } from 'stream';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { STREAM_REQUEST_HEADER } from '../constants';
import { ClovaStreamToken } from '../types';
import { ClovaEventParser } from '../utils';

@Injectable()
export class StreamInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx: HttpArgumentsHost = context.switchToHttp();
    const response: any = ctx.getResponse();

    response.set(STREAM_REQUEST_HEADER);

    return new Observable(() => {
      next.handle().subscribe({
        next: (_) => {
          const reader = _.body.getReader();

          const readableStream: Readable = new Readable({
            read() {
              reader
                .read()
                .then(({ done, value }) => {
                  if (done) {
                    this.push(null);
                  } else {
                    this.push(value);
                  }
                })
                .catch((err) => this.destroy(err));
            },
          });

          const clovaEventParser: ClovaEventParser = new ClovaEventParser();

          const writableStream: Writable = new Writable({
            write(chunk, _, callback) {
              response.write(chunk);
              callback();
            },
          });

          const transformStream: Transform = new Transform({
            transform(chunk, _, callback) {
              const tokens: ClovaStreamToken[] = clovaEventParser.parse(chunk);

              for (const token of tokens) {
                if (token && 'message' in token) {
                  writableStream.write(token.message.content);
                  if (token.stopReason) {
                    writableStream.end();
                  }
                }
              }

              callback();
            },
          });

          readableStream
            .pipe(transformStream)
            .pipe(writableStream)
            .on('finish', () => response.end())
            .on('error', (err) => {
              console.error(err);
              response.end();
            });

          readableStream.on('error', (err) => {
            console.error(err);
            response.end();
          });

          transformStream.on('error', (err) => {
            console.error(err);
            response.end();
          });

          writableStream.on('error', (err) => {
            console.error(err);
            response.end();
          });
        },
        error: (err) => {
          console.error(err);
          response.end();
        },
      });
    });
  }
}
