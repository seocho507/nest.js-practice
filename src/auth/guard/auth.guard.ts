import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {EnvironmentConstant} from "../../common/constants/constant-env";
import {Reflector} from "@nestjs/core";
import {Public} from "../decorator/public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {


    constructor(
        private readonly reflector: Reflector
    ) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.get(Public, context.getHandler())
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        if (!request.user || request.user.type !== EnvironmentConstant.TYPE_ACCESS) {
            console.log("Something wrong with user");
            console.log(request.user);
            return false;
        }

        return true;
    }
}