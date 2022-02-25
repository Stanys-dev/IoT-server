import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { StringDecoder } from 'string_decoder';
import cbor from 'cbor';

@Injectable()
export class BufferDecoderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const decoder = new StringDecoder('hex');
    let buffer = '';

    req.on('data', function(data) {
      buffer += decoder.write(data);
    });

    req.on('end', function() {
      buffer += decoder.end();

      if (buffer) {
        req.body = cbor.decodeFirstSync(
          // @ts-ignore
          buffer instanceof Buffer ? buffer : Buffer.from(buffer, 'hex'),
        );
      }
      next();
    });
  }
}
