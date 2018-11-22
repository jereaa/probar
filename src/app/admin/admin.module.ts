import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";

import { AdminRoutingModule } from "./admin-routing.module";
import { AdminMaterialModule } from "./admin-material.module";
import { AdminComponent } from "./admin.component";
import { ServicesComponent } from "./pages/services/services.component";
import { ServiceComponent } from "./pages/service/service.component";
import { SharedModule } from "../shared.module";

@NgModule({
    declarations: [AdminComponent, ServicesComponent, ServiceComponent],
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
