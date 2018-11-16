import { BrowserModule, Title } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { MaterialModule } from "./material.module";
import { AppComponent } from "./app.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CallbackComponent } from "./core/callback.component";
import { AdminGuard } from "./auth/admin.guard";

@NgModule({
    declarations: [AppComponent, CallbackComponent],
    imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, ReactiveFormsModule, MaterialModule],
    providers: [Title, AdminGuard],
    bootstrap: [AppComponent]
})
export class AppModule {}
