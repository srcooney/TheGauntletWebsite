import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs/Rx";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {


    constructor(private authService:AuthService, private router:Router) {

    }

    canActivate(route:ActivatedRouteSnapshot,
                state:RouterStateSnapshot):Observable<boolean> {
        return this.authService.authInfo$
            .map(authInfo => authInfo.isAdmin())
            .take(1)
            .do(admin => {
                if(!admin) {
                    alert("You are not an admin!");
                    this.router.navigate(['/events']);
                }
            });
    }

}