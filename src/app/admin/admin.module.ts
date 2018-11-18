import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { AdminRoutingModule } from "./admin-routing.module";
import { AdminComponent } from "./admin.component";
import { AdminMaterialModule } from "./admin-material.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [AdminComponent],
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, AdminRoutingModule, AdminMaterialModule]
})
export class AdminModule {}
