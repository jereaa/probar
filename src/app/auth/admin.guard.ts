import { Injectable } from "@angular/core";
import { CanLoad, Route, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable({
    providedIn: "root"
})
export class AdminGuard implements CanActivateChild, CanLoad {

    constructor(
        private auth: AuthService,
        private router: Router
    ) {}

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if (this.auth.isAdmin) {
            return true;
        }

        if (this.auth.loggedIn) {
            this.router.navigate(["/"]);
        } else {
            this.auth.login(state.url);
        }
        return false;
    }

    canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
        if (this.auth.isAdmin) {
            return true;
        }

        if (this.auth.loggedIn) {
            this.router.navigate(["/"]);
        } else {
            this.auth.login(route.path);
        }
        return false;
    }
}
