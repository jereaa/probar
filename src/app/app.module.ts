import { BrowserModule, Title } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared.module";

import { AppComponent } from "./app.component";
import { CallbackComponent } from "./core/callback.component";
import { AdminGuard } from "./auth/admin.guard";

@NgModule({
    declarations: [AppComponent, CallbackComponent],
    imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, AppRoutingModule, SharedModule],
    providers: [Title, AdminGuard],
    bootstrap: [AppComponent]
})
export class AppModule {}
