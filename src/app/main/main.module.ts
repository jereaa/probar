import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MainRoutingModule } from "./main-routing.module";
import { SharedModule } from "../shared.module";

import { MainComponent } from "./main.component";
import { HeaderComponent } from "./header/header.component";

@NgModule({
    declarations: [MainComponent, HeaderComponent],
    imports: [CommonModule, MainRoutingModule, SharedModule]
})
export class MainModule {}
