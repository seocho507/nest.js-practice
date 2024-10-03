import {Role, User} from "../user/entities/user.entity";
import {BadRequestException, Injectable, UnauthorizedException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import {Constant} from "../common/constants/constant";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {
    }

    parseBasicToken(rawToken: string) {
        /// 1) 토큰을 " " 기준으로 스플릿 한 후 토큰 값만 추출하기
        /// ["Basic", $token]
        const basicSplit = rawToken.split(" ");

        if (basicSplit.length !== 2) {
            throw new BadRequestException("토큰 포맷이 잘못됐습니다!");
        }

        const [basic, token] = basicSplit;

        if (basic.toLowerCase() !== "basic") {
            throw new BadRequestException("토큰 포맷이 잘못됐습니다!");
        }

        /// 2) 추출한 토큰을 base64 디코딩해서 이메일과 비밀번호로 나눈다.
        const decoded = Buffer.from(token, "base64").toString("utf-8");

        /// "email:password"
        /// [email, password]
        const tokenSplit = decoded.split(":");

        if (tokenSplit.length !== 2) {
            throw new BadRequestException("토큰 포맷이 잘못됐습니다!")
        }

        const [email, password] = tokenSplit;

        return {
            email,
            password,
        }
    }

    async parseBearerToken(rawToken: string, isRefreshToken: boolean) {
        const basicSplit = rawToken.split(" ");

        if (basicSplit.length !== 2) {
            throw new BadRequestException("토큰 포맷이 잘못됐습니다!");
        }

        const [bearer, token] = basicSplit;

        if (bearer.toLowerCase() !== "bearer") {
            throw new BadRequestException("토큰 포맷이 잘못됐습니다!");
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>(
                    isRefreshToken ? Constant.REFRESH_TOKEN_SECRET : Constant.ACCESS_TOKEN_SECRET,
                ),
            });

            if (isRefreshToken) {
                if (payload.type !== Constant.TYPE_REFRESH) {
                    throw new BadRequestException("Refresh 토큰을 입력 해주세요!");
                }
            } else {
                if (payload.type !== Constant.TYPE_ACCESS) {
                    throw new BadRequestException("Access 토큰을 입력 해주세요!")
                }
            }

            return payload;
        } catch (e) {
            throw new UnauthorizedException("토큰이 만료됐습니다!");
        }
    }

    /// rawToken -> "Basic $token"
    async register(rawToken: string) {
        const {email, password} = this.parseBasicToken(rawToken);

        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (user) {
            throw new BadRequestException("이미 가입한 이메일 입니다!");
        }

        const hash = await bcrypt.hash(password, this.configService.get<number>(Constant.HASH_ROUNDS));

        await this.userRepository.save({
            email,
            password: hash,
        });

        return this.userRepository.findOne({
            where: {
                email,
            },
        });
    }

    async authenticate(email: string, password: string) {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            throw new BadRequestException("잘못된 로그인 정보입니다!");
        }

        const passOk = await bcrypt.compare(password, user.password);

        if (!passOk) {
            throw new BadRequestException("잘못된 로그인 정보입니다!");
        }

        return user;
    }

    async issueToken(user: { id: number, role: Role }, isRefreshToken: boolean) {
        const refreshTokenSecret = this.configService.get<string>(Constant.REFRESH_TOKEN_SECRET);
        const accessTokenSecret = this.configService.get<string>(Constant.ACCESS_TOKEN_SECRET);

        return this.jwtService.signAsync({
            sub: user.id,
            role: user.role,
            type: isRefreshToken ? Constant.TYPE_REFRESH : Constant.TYPE_ACCESS,
        }, {
            secret: isRefreshToken ? refreshTokenSecret : accessTokenSecret,
            expiresIn: isRefreshToken ? Constant.REFRESH_TOKEN_EXPIRES : Constant.ACCESS_TOKEN_EXPIRES,
        })
    }

    async login(rawToken: string) {
        const {email, password} = this.parseBasicToken(rawToken);

        const user = await this.authenticate(email, password);

        return {
            refreshToken: await this.issueToken(user, true),
            accessToken: await this.issueToken(user, false),
        }
    }
}