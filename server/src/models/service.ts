import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IService extends mongoose.Document {
    code: string;
    name: string;
    value: number;
    additional: boolean;
    price: number;
    ordered_times: number;
    last_ordered: Date;
}

export const serviceSchema = new Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    additional: { type: Boolean, default: false },
    price: { type: Number, required: true },
    value: { type: Number },
    ordered_times: { type: Number, default: 0},
    last_ordered: { type: Date }
});

serviceSchema.pre("save", (next) => {
    if (this.isNew) {
        ServiceModel.findOne().sort("-value").exec((err: Error, service) => {
            if (err) {
                console.error(`Error saving service! Error: ${err}`);
            }

            if (!service) {
                this.value = 1;
            } else {
                this.value = service.value;
            }
            next();
        });
    }
    next();
});

export const ServiceModel = mongoose.model<IService>("service", serviceSchema);
