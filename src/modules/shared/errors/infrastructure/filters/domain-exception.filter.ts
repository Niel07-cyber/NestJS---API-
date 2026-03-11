import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../domain/exceptions/domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = this.getHttpStatus(exception.code);

    response.status(status).json({
      statusCode: status,
      error: exception.code,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getHttpStatus(code: string): number {
    const statusMap: Record<string, number> = {
  USER_CANNOT_CREATE_POST: 403,
  USER_CANNOT_UPDATE_POST: 403,
  USER_CANNOT_DELETE_POST: 403,
  POST_ALREADY_PUBLISHED: 400,
  INVALID_TITLE: 400,
  INVALID_CONTENT: 400,
  POST_NOT_FOUND: 404,
  TAG_ALREADY_EXISTS: 409,
  TAG_NOT_FOUND: 404,
  FORBIDDEN: 403,
  TAG_ALREADY_ASSOCIATED: 409,
  INVALID_POST_TRANSITION: 400,
  NOT_POST_AUTHOR: 403,
  NOT_MODERATOR: 403,
  SLUG_ALREADY_EXISTS: 409,
  INVALID_SLUG: 400,
};
    return statusMap[code] || 400;
  }
}
