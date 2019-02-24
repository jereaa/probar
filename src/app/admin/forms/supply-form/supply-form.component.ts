import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

import { SupplyModel, SupplyCategory } from "src/app/core/models/supply.model";
import { ConfigService } from "../../services/config.service";
import { ServicesService } from "../../services/services.service";
import { InventoryService } from "../../services/inventory.service";
import { ServiceModel } from "src/app/core/models/service.model";
import { zip } from "rxjs";
import { IConfig } from "src/app/core/models/config.interface";

@Component({
    selector: "app-supply-form",
    templateUrl: "./supply-form.component.html",
    styleUrls: ["./supply-form.component.scss"]
})
export class SupplyFormComponent implements OnInit {
    @Input() supply: SupplyModel;
    isEdit: boolean;
    loading: boolean;
    errorLoading: boolean;

    supplyCategories: { value: string, display_en: string }[];
    services: ServiceModel[];

    // Form
    submitting: boolean;
    supplyForm: FormGroup;
    submitSupplySub: Subscription;

    constructor(
        private configService: ConfigService,
        private servicesService: ServicesService,
        private inventoryService: InventoryService,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.isEdit = !!this.supply;
        this.loading = true;

        const config$ = this.configService.getConfig();
        const services$ = this.servicesService.getServices();

        zip(config$, services$, (config: IConfig, services: ServiceModel[]) => ({config, services}))
            .subscribe(
            pair => {
                this.supplyCategories = pair.config.inventory.supply_categories;
                this.services = pair.services;
                this.loading = false;
                this._buildForm();
            },
            error => {
                this.loading = false;
                this.errorLoading = true;
            }
        );
    }

    private _buildForm(): void {
        this.supply = this.isEdit ? this.supply : new SupplyModel("", "", SupplyCategory.BASE, 0, 0, "", 0, 0);

        this.supplyForm = this.fb.group({
            brand: [this.supply.brand],
            generic_name: [this.supply.generic_name],
            category: [this.isEdit ? this.supply.category : "", [Validators.required]],
            quantity: [this.isEdit ? this.supply.quantity : "", [Validators.min(0)]],
            amount: [this.isEdit ? this.supply.amount : "", [Validators.min(0)]],
            unit: [this.supply.unit],
            price: [this.isEdit ? this.supply.price : "", [Validators.required, Validators.min(0)]],
            servicesId: [this.isEdit ? this.supply.servicesId : "", [Validators.required]]
        });

        // In case we are editing a list,
        // trigger immediate validation by marking
        // fields as dirty in case field is no longer valid
        if (this.isEdit) {
            for (const key in this.supplyForm.controls) {
                if (this.supplyForm.controls.hasOwnProperty(key)) {
                    this.supplyForm.controls[key].markAsDirty();
                }
            }
        }
    }

    getServiceNameForValue(value: number): string {
        return this.services.find((service) => service.value === value).name;
    }

    submitForm(): void {
        if (!this.supplyForm.valid) {
            return;
        }

        let servicesValue = 0;

        if (this.supplyForm.controls.servicesId.value.length > 1) {
            this.supplyForm.controls.servicesId.value.forEach(element => {
                servicesValue += element;
            });
        } else {
            servicesValue = this.supplyForm.controls.servicesId.value;
        }

        const supply = new SupplyModel(
            this.supplyForm.controls.brand.value,
            this.supplyForm.controls.generic_name.value,
            this.supplyForm.controls.category.value,
            this.supplyForm.controls.quantity.value,
            this.supplyForm.controls.amount.value,
            this.supplyForm.controls.unit.value,
            this.supplyForm.controls.price.value,
            servicesValue
        );

        this.inventoryService.createSupply(supply).subscribe(
            (res) => this._handleSuccess(),
            (error) => this._handleError(error)
        );
    }

    private _handleSuccess(): void {

    }

    private _handleError(error: Error): void {
        
    }
}
