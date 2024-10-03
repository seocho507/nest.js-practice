import {AuthGuard, PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {AuthService} from "../auth.service";
import {Injectable} from "@nestjs/common";

export class LocalAuthGuard extends AuthGuard("local") {
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            usernameField: "email",
            passwordField: "password"
        });
    }

    async validate(email: string, password: string) {
        return await this.authService.authenticate(email, password);
    }
}