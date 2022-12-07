import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TracingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers['x-correlation-id']) {
      const correlationId = uuidV4();
      req.headers['x-correlation-id'] = correlationId;
      res.set('X-Correlation-Id', correlationId);
    }

    if (!req.headers['x-request-id']) {
      const requestId = uuidV4();
      req.headers['x-request-id'] = requestId;
      res.set('X-Request-Id', requestId);
    }

    if (!req.headers['trace-id']) {
      const amazonLbTraceId = req.headers['x-amzn-trace-id'];
      const traceId =
        typeof amazonLbTraceId === 'string' ? amazonLbTraceId : uuidV4();

      req.headers['trace-id'] = traceId;
      res.set('Trace-Id', traceId);
    }

    next();
  }
}
