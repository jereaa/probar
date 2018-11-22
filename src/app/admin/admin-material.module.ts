import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule
} from "@angular/material";

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    exports: [
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatButtonModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule
    ]
})
export class AdminMaterialModule {}
