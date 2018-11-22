import { Component, OnInit, OnDestroy } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

import { ServiceModel } from "src/app/core/models/service.model";
import { ServerError } from "server/src/models/server-error";
import { ErrorCode } from "../../api/server-error.model";
import { ServicesService } from "../../services/services.service";
import { uniqueServiceCodeValidator } from "../../forms/code-taken.validator";

@Component({
    selector: "app-service",
    templateUrl: "./service.component.html",
    styleUrls: ["./service.component.scss"]
})
export class ServiceComponent implements OnInit, OnDestroy {
    isEdit: boolean;
    loading: boolean;
    errorLoading: boolean;
    loadSub: Subscription;
    pageTitle: string;

    service: ServiceModel;

    // Form
    serviceForm: FormGroup;
    submitting: boolean;
    submitServiceSub: Subscription;

    constructor(
        private title: Title,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private serviceService: ServicesService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.loadSub = this.activatedRoute.params.subscribe((params) => {
            this._getService(params["code"]);
        });
    }

    ngOnDestroy(): void {
        if (this.loadSub) {
            this.loadSub.unsubscribe();
        }
    }

    private _getService(code: string): void {
        this.isEdit = code !== "0";
        if (code === "0") {
            this.service = new ServiceModel("0", "", false, 0, "");
            this.loading = false;
            this.pageTitle = "New service";
            this.title.setTitle(this.pageTitle);
            this._buildForm();
        } else {
            this.loadSub = this.serviceService.getService(code).subscribe(
                (service) => {
                    this.service = service;
                    this.pageTitle = "Edit service";
                    this.title.setTitle(this.pageTitle);
                    this._buildForm();
                },
                (error) => {
                    if (error.code === ErrorCode.SERVICE_CODE_NOT_FOUND) {
                        console.error(error.message);
                        this.router.navigate(["admin/services"]);
                        return;
                    }

                    this.errorLoading = true;
                    console.error(`Error ocurred: ${JSON.stringify(error)}`);
                },
                () => (this.loading = false)
            );
        }
    }

    private _buildForm(): void {
        this.serviceForm = this.fb.group({
            code: new FormControl(this.isEdit ? this.service.code : "", {
                asyncValidators: [uniqueServiceCodeValidator(this.serviceService, this.service._id)],
                updateOn: "blur"
            }),
            name: [this.service.name],
            price: [this.isEdit ? this.service.price : ""],
            description: [this.service.description],
            additional: [this.service.additional]
        });

        // In case we are editing a list,
        // trigger immediate validation by marking
        // fields as dirty in case field is no longer valid
        if (this.isEdit) {
            for (const key in this.serviceForm.controls) {
                if (this.serviceForm.controls.hasOwnProperty(key)) {
                    this.serviceForm.controls[key].markAsDirty();
                }
            }
        }
    }

    submitForm(): void {
        if (this.serviceForm.invalid) {
            return;
        }

        const oldCode = this.service.code;

        this.service.code = this.serviceForm.controls.code.value;
        this.service.name = this.serviceForm.controls.name.value;
        this.service.additional = this.serviceForm.controls.additional.value;
        this.service.description = this.serviceForm.controls.description.value;
        this.service.price = this.serviceForm.controls.price.value;

        this.submitting = true;
        if (!this.isEdit) {
            this.submitServiceSub = this.serviceService.createService(this.service).subscribe(
                () => this._handleSuccess(),
                (error) => this._handleError(error)
            );
        } else {
            this.submitServiceSub = this.serviceService.updateService(oldCode, this.service).subscribe(
                () => this._handleSuccess(),
                (error) => this._handleError(error)
            );
        }
    }

    cancel(): void {
        this.router.navigate(["admin/services"]);
    }

    private _handleSuccess(): void {
        this.router.navigate(["admin/services"]);
    }

    private _handleError(error: ServerError): void {
        this.submitting = false;
        if (error.code === ErrorCode.SERVICE_DUPLICATE_CODE) {
            this.serviceForm.controls.code.setErrors({ uniqueCode: true });
            this.serviceService.forceUpdate();
            const subs = this.serviceForm.controls.code.valueChanges.subscribe(() => {
                this.serviceForm.controls.code.setErrors(null);
                subs.unsubscribe();
            });
        }
    }
}
