import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {Reflector} from "@nestjs/core";
import {Role} from "../../user/entities/user.entity";

@Injectable()
export class RBACGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector
    ) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const role = this.reflector.get<Role>(Role, context.getHandler());

        if (!Object.values(Role).includes(role)) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            return false;
        }

        return user.role <= role;
    }

}