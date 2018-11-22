import { Component, ChangeDetectorRef, OnInit } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";

import { AuthService } from "../auth/auth.service";

@Component({
    selector: "app-admin",
    templateUrl: "./admin.component.html",
    styleUrls: ["./admin.component.scss"]
})
export class AdminComponent {
    testString = "";
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        private auth: AuthService
    ) {
        this.mobileQuery = media.matchMedia("(max-width: 600px)");
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    public logout(): void {
        this.auth.logout();
    }

}
