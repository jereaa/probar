import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MaterialModule } from "./material.module";

import { SpinnerComponent } from "./core/spinner/spinner.component";

@NgModule({
    declarations: [
        SpinnerComponent
    ],
    imports: [
        CommonModule,
        MaterialModule
    ],
    exports: [
        MaterialModule,
        SpinnerComponent
    ]
})
export class SharedModule {}
