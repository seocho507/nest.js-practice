import {ArgumentsHost, Catch, ExceptionFilter} from "@nestjs/common";
import {QueryFailedError} from "typeorm";

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = 400;

        console.log(exception);

        let message = 'DB Error';

        if (exception.message.includes('duplicate key')) {
            message = '중복된 Key가 존재합니다.';
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        })
    }
}