import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as auth0 from "auth0-js";
import { Subscription, timer } from "rxjs";

import { AUTH_CONFIG } from "./auth.config";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    auth = new auth0.WebAuth({
        clientID: AUTH_CONFIG.CLIENT_ID,
        domain: AUTH_CONFIG.DOMAIN,
        audience: AUTH_CONFIG.AUDIENCE,
        responseType: AUTH_CONFIG.RESPONSE_TYPE,
        redirectUri: AUTH_CONFIG.REDIRECT,
        scope: AUTH_CONFIG.SCOPE
    });
    userProfile: auth0.Auth0UserProfile;
    isAdmin: boolean;
    loggedIn: boolean;

    refreshSub: Subscription;

    constructor(public router: Router) {
        const profile = localStorage.getItem("profile");

        if (this.tokenValid) {
            this.userProfile = JSON.parse(profile);
            this.isAdmin = localStorage.getItem("isAdmin") === "true";
            this.loggedIn = true;
            this.scheduleRenewal();
        } else if (profile) {
            this.logout();
        }
    }

    public login(redirect?: string): void {
        const _redirect = redirect ? redirect : this.router.url;
        localStorage.setItem("auth_redirect", _redirect);
        this.auth.authorize();
    }

    public handleAuth(): void {
        this.auth.parseHash((error, authResult) => {
            if (error) {
                this.clearRedirect();
                this.router.navigate(["/"]);
                console.error(`Authentication error: ${error.error} - ${error.errorDescription}`);
            } else if (authResult && authResult.accessToken && authResult.idToken) {
                this.getProfile(authResult);
            }
        });
    }

    private getProfile(authResult: auth0.Auth0DecodedHash): void {
        // Use access token to retrieve user's profile and set session
        this.auth.client.userInfo(authResult.accessToken, (error, profile) => {
            if (error) {
                console.error(`Authentication error: ${error.error} - ${error.errorDescription}`);
                return;
            }
            this.setSession(authResult, profile);
            this.redirect();
            this.clearRedirect();
        });
    }

    private setSession(authResult: auth0.Auth0DecodedHash, profile?: auth0.Auth0UserProfile): void {
        // Set the time that the access token will expire at
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem("access_token", authResult.accessToken);
        localStorage.setItem("id_token", authResult.idToken);
        localStorage.setItem("expires_at", expiresAt);

        if (profile) {
            localStorage.setItem("profile", JSON.stringify(profile));
            this.userProfile = profile;
            this.isAdmin = this.checkAdmin(profile);
            localStorage.setItem("isAdmin", this.isAdmin.toString());
        }

        this.loggedIn = true;
        this.scheduleRenewal();
    }

    private checkAdmin(profile: auth0.Auth0UserProfile): boolean {
        // Check if the user has admin roles
        const roles: string[] = profile[AUTH_CONFIG.NAMESPACE + AUTH_CONFIG.CLIENT_ID].roles || [];
        return roles.indexOf("admin") !== -1;
    }

    private redirect(): void {
        const redirectURI = decodeURI(localStorage.getItem("auth_redirect"));
        this.router.navigate([redirectURI || "/"]);
    }

    private clearRedirect(): void {
        localStorage.removeItem("auth_redirect");
    }

    public logout(noRedirect?: boolean): void {
        // Delete all keys in storage
        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("profile");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("auth_redirect");

        // Reset local properties
        this.userProfile = undefined;
        this.isAdmin = undefined;
        this.loggedIn = false;

        if (noRedirect !== true) {
            this.router.navigate(["/"]);
        }
    }

    get tokenValid(): boolean {
        // Check if current time is past access token's expiration
        const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
        return Date.now() < expiresAt;
    }

    private renewToken(): void {
        this.auth.checkSession({}, (err, authResult: auth0.Auth0DecodedHash) => {
            if (err) {
                console.warn(`Couldn't renew token: ${err.error} - ${err.errorDescription}`);
                this.logout(true);
            } else if (authResult && authResult.accessToken) {
                console.log("Token renwed successfully");
                this.setSession(authResult);
            }
        });
    }

    private scheduleRenewal(): void {
        if (!this.tokenValid) {
            return;
        }

        // Unsuscribe from previous observable
        this.unscheduleRenewal();

        const expiresAt: number = JSON.parse(localStorage.getItem("expires_at"));
        const expiresIn = expiresAt - Date.now();
        this.refreshSub = timer(Math.max(1, expiresIn)).subscribe(
            () => {
                this.renewToken();
                this.scheduleRenewal();
            },
            (error) => console.error(`Error renewing token: ${error}`)
        );
    }

    private unscheduleRenewal(): void {
        if (this.refreshSub) {
            this.refreshSub.unsubscribe();
        }
    }
}
