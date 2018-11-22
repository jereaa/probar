import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IService extends mongoose.Document {
    code: string;
    name: string;
    description: string;
    value: number;
    additional: boolean;
    price: number;
    event_count: number;
    last_event: Date;
}

const serviceSchema = new Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    additional: { type: Boolean, default: false },
    price: { type: Number, required: true },
    value: { type: Number, required: true, unique: true },
    event_count: { type: Number, default: 0},
    last_event: { type: Date, default: null }
});

export const ServiceModel = mongoose.model<IService>("service", serviceSchema);
