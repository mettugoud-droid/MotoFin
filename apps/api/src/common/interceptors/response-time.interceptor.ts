import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = Date.now();

    return next.handle().pipe(
      map((data: unknown) => {
        const response = context.switchToHttp().getResponse();
        const responseTime = Date.now() - startTime;
        response.setHeader('X-Response-Time', `${responseTime}ms`);
        return data;
      }),
    );
  }
}
