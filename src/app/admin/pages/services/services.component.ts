import { Component, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { MatSort, MatTableDataSource } from "@angular/material";

import { ServiceModel } from "src/app/core/models/service.model";
import { Router } from "@angular/router";
import { ServicesService } from "../../services/services.service";

@Component({
    selector: "app-services",
    templateUrl: "./services.component.html",
    styleUrls: ["./services.component.scss"]
})
export class ServicesComponent implements OnInit {
    pageTitle = "Services";

    loading: boolean;
    error: boolean;

    displayedColumns: string[] = ["name", "additional", "event_count", "price"];
    dataSource: MatTableDataSource<ServiceModel>;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private title: Title,
        private router: Router,
        private servicesService: ServicesService
    ) {}

    ngOnInit(): void {
        this.title.setTitle(this.pageTitle);
        this.loading = true;

        this.servicesService.getServices().subscribe(
            (services) => {
                this.buildTable(services);
                this.error = false;
            },
            (error: Error) => {
                this.error = true;
                console.error(`There was an error getting the services: ${error}`);
            },
            () => this.loading = false
        );
    }

    private buildTable(services: ServiceModel[]): void {
        this.dataSource = new MatTableDataSource(services);
        this.dataSource.sort = this.sort;
    }

    public editService(code: string): void {
        this.router.navigate([`admin/services/${code}`]);
    }
}
