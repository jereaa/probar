import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { MatDialog } from "@angular/material";

import { AdminApiService } from "../../api/admin-api.service";
import { SupplyCategory, SupplyModel } from "src/app/core/models/supply.model";
import { InventoryDialogComponent } from "./inventory-dialog.component";

@Component({
    selector: "app-inventory",
    templateUrl: "./inventory.component.html",
    styleUrls: ["./inventory.component.scss"]
})
export class InventoryComponent implements OnInit {
    pageTitle = "Inventory";

    loading: boolean;

    supplies: Map<SupplyCategory, SupplyModel[]>;

    constructor(
        private title: Title,
        private api: AdminApiService,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.title.setTitle(this.pageTitle);
        // this.loading = true;
    }

    openDialog(supply?: SupplyModel): void {
        this.dialog.open(InventoryDialogComponent, {
            data: supply,
            minWidth: "25em",
            minHeight: "20em",
            panelClass: "inventory-dialog"
        });
    }
}
