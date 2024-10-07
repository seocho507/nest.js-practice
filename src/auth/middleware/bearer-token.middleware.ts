import {BadRequestException, Injectable, NestMiddleware, UnauthorizedException} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";
import {EnvironmentConstant} from "../../common/constants/constant-env";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {


    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {
    }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            next();
            return;
        }
        const token = this.validateBearerToken(authHeader);

        try {
            const decodedPayload = await this.jwtService.decode(token);
            const tokenType = decodedPayload.type;
            if (tokenType != EnvironmentConstant.TYPE_ACCESS && tokenType != EnvironmentConstant.TYPE_REFRESH) {
                throw new UnauthorizedException("Token type is invalid");
            }

            const secretKey = this.configService.get<string>(
                tokenType === EnvironmentConstant.TYPE_REFRESH ?
                    EnvironmentConstant.REFRESH_TOKEN_SECRET : EnvironmentConstant.ACCESS_TOKEN_SECRET,
            )

            const payload = await this.jwtService.verifyAsync(token, {
                secret: secretKey,
            });
            const isRefreshToken = tokenType === EnvironmentConstant.TYPE_REFRESH;

            if (isRefreshToken) {
                if (payload.type !== EnvironmentConstant.TYPE_REFRESH) {
                    throw new BadRequestException("Refresh 토큰을 입력 해주세요!");
                }
            } else {
                if (payload.type !== EnvironmentConstant.TYPE_ACCESS) {
                    throw new BadRequestException("Access 토큰을 입력 해주세요!")
                }
            }

            req.user = payload;
        } catch (e) {
            throw new UnauthorizedException("토큰이 만료됐습니다!");
        }
    }

    private validateBearerToken(rawToken: string): string {
        const basicSplit = rawToken.split(" ");

        if (basicSplit.length !== 2) {
            throw new BadRequestException("토큰 포맷이 잘못됐습니다!");
        }

        const [bearer, token] = basicSplit;

        if (bearer.toLowerCase() !== "bearer") {
            throw new BadRequestException("토큰 포맷이 잘못됐습니다!");
        }
        return token;
    }
}