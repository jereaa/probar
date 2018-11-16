import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CallbackComponent } from "./core/callback.component";
import { AdminGuard } from "./auth/admin.guard";

const routes: Routes = [
    {
        path: "admin",
        loadChildren: "./admin/admin.module#AdminModule",
        canLoad: [AdminGuard]
    },
    {
        path: "callback",
        component: CallbackComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
