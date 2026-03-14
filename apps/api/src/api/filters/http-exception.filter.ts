import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from "@nestjs/common";
import type { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  private extractMessage(exception: unknown): string | string[] {
    if (!(exception instanceof HttpException)) {
      return "Error interno del servidor";
    }

    const response = exception.getResponse();
    if (typeof response === "string") {
      return response;
    }

    if (typeof response === "object" && response !== null) {
      const maybeMessage = (response as { message?: string | string[] }).message;
      if (Array.isArray(maybeMessage)) {
        return maybeMessage;
      }
      if (typeof maybeMessage === "string") {
        return maybeMessage;
      }
    }

    return exception.message;
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.extractMessage(exception);

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status}: ${message}`,
        exception instanceof Error ? exception.stack : undefined
      );
    }

    response.status(status).json({
      statusCode: status,
      error:
        status >= 500
          ? "INTERNAL_ERROR"
          : status === HttpStatus.TOO_MANY_REQUESTS
            ? "TOO_MANY_REQUESTS"
            : "REQUEST_ERROR",
      message,
      path: request.url,
      timestamp: new Date().toISOString()
    });
  }
}
