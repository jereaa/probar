import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AdminRoutingModule } from "./admin-routing.module";
import { AdminComponent } from "./admin.component";
import { AdminMaterialModule } from "./admin-material.module";

@NgModule({
    declarations: [AdminComponent],
    imports: [CommonModule, AdminRoutingModule, AdminMaterialModule]
})
export class AdminModule {}
