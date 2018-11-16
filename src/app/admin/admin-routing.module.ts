import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AdminComponent } from "./admin.component";
import { AdminGuard } from "../auth/admin.guard";

const routes: Routes = [
    {
        path: "",
        component: AdminComponent,
        canActivateChild: [AdminGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {}
