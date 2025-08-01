import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "@/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

    public constructor(private readonly userService: UserService){}

    public async canActivate(
        context: ExecutionContext
    ): Promise<boolean> { 
         
        const request = context.switchToHttp().getRequest()

        if(typeof request.session.userId === "undefined"){
            throw new UnauthorizedException(
                "You can`t access this page"
            )
        }

        const user = await this.userService.findById(request.session.userId)   

        request.user = user

        return true 

    }
}