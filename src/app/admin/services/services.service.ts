import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { tap, map } from "rxjs/operators";

import { AdminApiService } from "../api/admin-api.service";
import { ServiceModel } from "src/app/core/models/service.model";

@Injectable({
    providedIn: "root"
})
export class ServicesService {
    private readonly updateFrequency = 60 * 60 * 1000;  // Every hour in ms
    services: ServiceModel[];
    lastUpdated: Date;

    constructor(
        private api: AdminApiService
    ) {}

    private get shouldUpdate(): boolean {
        return !this.services || Date.now() - this.lastUpdated.getTime() >= this.updateFrequency;
    }

    public forceUpdate(): void {
        this.services = null;
        this.lastUpdated = null;
    }

    public getServices(): Observable<ServiceModel[]> {
        // If our array is not initialized yet or it's too old, we request the services from the server
        if (this.shouldUpdate) {
            return this.api.getServices()
            .pipe(
                tap(s => {
                    this.services = s;
                    this.lastUpdated = new Date();
                })
            );
        }

        return Observable.create((observer: Observer<ServiceModel[]>) => {
            observer.next(this.services);
            observer.complete();
        });
    }

    public getService(code: string): Observable<ServiceModel> {
        if (!this.services) {
            return this.api.getService(code);
        }

        const service = this.services.find((s) => s.code === code);
        if (!service) {
            return this.api.getService(code);
        }
        return Observable.create((observer: Observer<ServiceModel>) => {
            observer.next(service);
            observer.complete();
        });
    }

    public createService(service: ServiceModel): Observable<ServiceModel> {
        return this.api.createService(service)
            .pipe(
                tap(s => {
                    // If we have a services array and it's not too old, then we add this new service to it
                    if (!this.shouldUpdate) {
                        this.services.push(s);
                    }
                })
            );
    }

    public updateService(oldCode: string, service: ServiceModel): Observable<ServiceModel> {
        return this.api.updateService(oldCode, service)
            .pipe(
                tap(s => {
                    // If we have a services array and it's not too old,
                    // then we replace the old service with the new one
                    if (!this.shouldUpdate) {
                        const index = this.services.findIndex((ser) => ser.code === oldCode);
                        if (index !== -1) {
                            this.services.splice(index, 1, s);
                        }
                    }
                })
            );
    }

    public isCodeTaken(code: string, serviceId?: string): Observable<boolean> {
        return this.getServices()
            .pipe(
                map(services => services.filter(service => service.code === code && service._id !== serviceId)),
                map(services => !!services.length)
            );
    }
}
