import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { catchError, delay } from "rxjs/operators";

import { AuthService } from "../../auth/auth.service";
import { ENV } from "../../core/env.config";
import { ServiceModel } from "../../core/models/service.model";

@Injectable({
    providedIn: "root"
})
export class AdminApiService {
    // TODO: Delete all delay calls
    private readonly requestDelay = 1500;

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

    public getServices(): Observable<ServiceModel[]> {
        return this.http
            .get<ServiceModel[]>(`${ENV.BASE_API}/admin/services`, {
                headers: new HttpHeaders().set("Authorization", this.authHeader)
            })
            .pipe(delay(this.requestDelay), catchError(this.errorHandler));
    }

    public getService(code: string): Observable<ServiceModel> {
        return this.http
            .get<ServiceModel>(`${ENV.BASE_API}/admin/services/${code}`, {
                headers: new HttpHeaders().set("Authorization", this.authHeader)
            })
            .pipe(delay(this.requestDelay), catchError(this.errorHandler));
    }

    public createService(service: ServiceModel): Observable<ServiceModel> {
        return this.http
            .post<ServiceModel>(`${ENV.BASE_API}/admin/services`, service, {
                headers: new HttpHeaders().set("Authorization", this.authHeader)
            })
            .pipe(delay(this.requestDelay), catchError(this.errorHandler));
    }

    public updateService(oldCode: string, service: ServiceModel): Observable<ServiceModel> {
        return this.http
            .put<ServiceModel>(`${ENV.BASE_API}/admin/services/${oldCode}`, service, {
                headers: new HttpHeaders().set("Authorization", this.authHeader)
            })
            .pipe(delay(this.requestDelay), catchError(this.errorHandler));
    }

    private errorHandler(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error("An error occurred:", error.error.message);
            return throwError(error);
        }
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(`Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`);
        return throwError(error.error);
    }
}
