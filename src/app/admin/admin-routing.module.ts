import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AdminComponent } from "./admin.component";
import { AdminGuard } from "../auth/admin.guard";
import { ServicesComponent } from "./pages/services/services.component";
import { ServiceComponent } from "./pages/service/service.component";

const routes: Routes = [
    {
        path: "",
        component: AdminComponent,
        canActivate: [AdminGuard],
        canActivateChild: [AdminGuard],
        children: [
            {
                path: "services",
                component: ServicesComponent
            },
            {
                path: "services/:code",
                component: ServiceComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {}
