import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Headers,
    Post,
    Request,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LocalAuthGuard} from "./strategy/local.strategy";
import {JwtAuthGuard} from "./strategy/jwt.strategy";

@Controller('/api/v1/auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    // authorization : Basic Token
    @Post("/register")
    async register(@Headers("authorization") rawToken: string) {
        return await this.authService.register(rawToken);
    }

    @Post("/login")
    async login(@Headers("authorization") rawToken: string) {
        return await this.authService.login(rawToken);
    }

    @Post("/token/access")
    async rotateAccessToken(@Request() request) {
        return {
            accessToken: await this.authService.issueToken(request.user, false),
        }
    }

    @Post("/login/passport")
    @UseGuards(LocalAuthGuard)
    async loginPassport(@Request() request) {
        return request.user;
    }

    @Get("private")
    @UseGuards(JwtAuthGuard)
    async private(@Request() request) {
        return request.user;
    }
}
