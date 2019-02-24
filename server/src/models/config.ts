import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IProbarConfig extends mongoose.Document {
    inventory: {
        supply_categories: {
            value: string;
            display_en: string;
        }[];
    };
}

const configSchema = new Schema({
    inventory: {
        supply_categories: [{
            _id: false,
            value: String,
            display_en: String
        }]
    }
}, {
    capped: { size: 1024, max: 1 },
});

export const ConfigModel = mongoose.model<IProbarConfig>("config", configSchema, "config");
