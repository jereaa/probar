export enum SupplyCategory {
    BASE = "base",
    LIQUORS = "liquors",
    ADDITIONALS = "additionals",
    NON_ALCOHOLIC = "non-alcoholic",
    PULPS = "pulps",
    PERISHABLE = "perishable",
    OTHERS = "others"
}

export class SupplyModel {
    constructor(
        public brand: string,
        public generic_name: string,
        public category: SupplyCategory,
        public quantity: number,
        public amount: number,
        public unit: string,
        public price: number,
        public servicesId: number,
        public _id?: string
    ) {}
}
