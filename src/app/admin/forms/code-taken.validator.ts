import { AbstractControl, ValidationErrors, AsyncValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { ServicesService } from "../services/services.service";

export function uniqueServiceCodeValidator(servicesService: ServicesService, serviceId?: string): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        return servicesService.isCodeTaken(control.value, serviceId).pipe(
            map(isTaken => isTaken ? { uniqueCode: true } : null),
            catchError(() => null)
        );
    };
}
