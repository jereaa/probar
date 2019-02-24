import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material";

import { AdminRoutingModule } from "./admin-routing.module";
import { AdminMaterialModule } from "./admin-material.module";
import { SharedModule } from "../shared.module";
import { AdminComponent } from "./admin.component";
import { ServicesComponent } from "./pages/services/services.component";
import { ServiceComponent } from "./pages/service/service.component";
import { InventoryComponent } from "./pages/inventory/inventory.component";
import { InventoryDialogComponent } from "./pages/inventory/inventory-dialog.component";
import { SupplyFormComponent } from "./forms/supply-form/supply-form.component";

@NgModule({
    declarations: [
        AdminComponent,
        ServicesComponent,
        ServiceComponent,
        InventoryComponent,
        InventoryDialogComponent,
        SupplyFormComponent
    ],
    entryComponents: [InventoryDialogComponent],
    providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
    imports: [
        CommonModule,
        SharedModule,
        HttpClientModule,
        ReactiveFormsModule,
        AdminRoutingModule,
        AdminMaterialModule
    ]
})
export class AdminModule {}
