import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger;
    private extractMessage;
    catch(exception: unknown, host: ArgumentsHost): void;
}
