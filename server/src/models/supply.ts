import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface ISupply extends mongoose.Document {
    brand: string;
    generic_name: string;
    category: string;
    quantity: number;
    amount: number;
    unit: string;
    price: number;
    servicesId: number;
}

const supplySchema = new Schema({
    brand: { type: String },
    generic_name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    amount: { type: Number, default: 1 },
    unit: { type: String },
    price: { type: Number, required: true },
    servicesId: { type: Number, required: true }
});

export const SupplyModel = mongoose.model<ISupply>("supply", supplySchema, "supplies");
