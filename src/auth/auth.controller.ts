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
import {Public} from "./decorator/public.decorator";
import {ApiBasicAuth, ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {Authorization} from "./decorator/authorization.decorator";

@ApiTags("auth")
@Controller('/api/v1/auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    // authorization : Basic Token
    @Public()
    @Post("/register")
    async register(@Authorization() rawToken: string) {
        return await this.authService.register(rawToken);
    }

    @ApiBasicAuth()
    @Public()
    @Post("/login")
    async login(@Authorization() rawToken: string) {
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
