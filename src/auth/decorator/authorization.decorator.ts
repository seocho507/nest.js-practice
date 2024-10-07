import {createParamDecorator} from "@nestjs/common";

export const Authorization = createParamDecorator(
    (data: string, ctx) => {
        const request = ctx.switchToHttp().getRequest();
        return request.headers.authorization;
    },
);
