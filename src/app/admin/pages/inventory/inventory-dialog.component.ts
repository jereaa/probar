import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import { SupplyModel } from "src/app/core/models/supply.model";

@Component({
    selector: "app-inventory-dialog",
    templateUrl: "./inventory-dialog.component.html",
    styleUrls: ["./inventory-dialog.component.scss"]
})
export class InventoryDialogComponent {
    dialogTitle: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data?: SupplyModel) {
        this.dialogTitle = data ? "Edit supply" : "New supply";
    }
}
