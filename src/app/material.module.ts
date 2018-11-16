import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
    MatProgressSpinnerModule
} from "@angular/material";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatProgressSpinnerModule
    ],
    exports: [
        MatProgressSpinnerModule
    ]
})
export class MaterialModule {}
