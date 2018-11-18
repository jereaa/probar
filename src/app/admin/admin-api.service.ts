import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { AuthService } from "../auth/auth.service";
import { ENV } from "../core/env.config";

@Injectable({
    providedIn: "root"
})
export class AdminApiService {

    constructor(private http: HttpClient, private auth: AuthService) {}

    private get authHeader(): string {
        return `Bearer ${localStorage.getItem("access_token")}`;
    }

    public test() {
        return this.http
            .get(`${ENV.BASE_API}/admin`, {
                headers: new HttpHeaders().set("Authorization", this.authHeader)
            })
            .pipe(catchError(this.errorHandler));
    }

    private errorHandler(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error("An error occurred:", error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(`Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`);
        }
        // return an observable with a user-facing error message
        return throwError("Something bad happened; please try again later.");
    }
}
