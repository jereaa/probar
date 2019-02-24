export interface IConfig {
    _id: string;
    inventory: {
        supply_categories: {
            value: string;
            display_en: string;
        }[];
    };
}
