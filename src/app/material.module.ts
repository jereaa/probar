import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
} from "@angular/material";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule
    ],
    exports: [
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule
    ]
})
export class MaterialModule {}
