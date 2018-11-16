import { Component } from "@angular/core";

@Component({
    selector: "app-callback",
    template: `
        <mat-spinner></mat-spinner>
    `,
    styles: [`
        :host {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `]
})
export class CallbackComponent {
    constructor() {}
}
