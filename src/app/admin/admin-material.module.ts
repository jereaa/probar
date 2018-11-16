import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule
} from "@angular/material";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatButtonModule
    ],
    exports: [
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatButtonModule
    ]
})
export class AdminMaterialModule {}
