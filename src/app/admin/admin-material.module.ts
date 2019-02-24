import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule
} from "@angular/material";

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    exports: [
        MatSidenavModule,
        MatListModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatSelectModule
    ]
})
export class AdminMaterialModule {}
