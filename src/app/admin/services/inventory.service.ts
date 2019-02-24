import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { tap } from "rxjs/operators";

import { SupplyModel } from "src/app/core/models/supply.model";
import { AdminApiService } from "../api/admin-api.service";

@Injectable({
    providedIn: "root"
})
export class InventoryService {
    private readonly updateFrequency = 60 * 60 * 1000;  // Every hour in ms
    supplies: SupplyModel[];
    lastUpdated: Date;

    constructor(
        private api: AdminApiService
    ) {}

    private get shouldUpdate(): boolean {
        return !this.supplies || Date.now() - this.lastUpdated.getTime() >= this.updateFrequency;
    }

    public getSupplies(): Observable<SupplyModel[]> {
        // If our array is not initialized yet or it's too old, we request the services from the server
        if (this.shouldUpdate) {
            return this.api.getSupplies()
            .pipe(
                tap(s => {
                    this.supplies = s;
                    this.lastUpdated = new Date();
                })
            );
        }

        return Observable.create((observer: Observer<SupplyModel[]>) => {
            observer.next(this.supplies);
            observer.complete();
        });
    }

    public createSupply(supply: SupplyModel): Observable<SupplyModel> {
        return this.api.createSupply(supply)
            .pipe(
                tap(s => {
                    // If we have a services array and it's not too old, then we add this new service to it
                    if (!this.shouldUpdate) {
                        this.supplies.push(s);
                    }
                })
            );
    }
}
