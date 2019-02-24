import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";

import { AdminApiService } from "../api/admin-api.service";
import { tap } from "rxjs/operators";
import { IConfig } from "src/app/core/models/config.interface";

@Injectable({
    providedIn: "root"
})
export class ConfigService {
    private readonly updateFrequency = 60 * 60 * 1000;  // Every hour in ms
    config: any;
    lastUpdated: Date;

    constructor(
        private api: AdminApiService
    ) {}

    private get shouldUpdate(): boolean {
        return !this.config || Date.now() - this.lastUpdated.getTime() >= this.updateFrequency;
    }

    public getConfig(): Observable<IConfig> {
        if (this.shouldUpdate) {
            return this.api.getConfig()
                .pipe(
                    tap(config => {
                        this.config = config;
                        this.lastUpdated = new Date();
                    })
                );
        }

        return Observable.create((observer: Observer<any>) => {
            observer.next(this.config);
            observer.complete();
        });
    }

}
