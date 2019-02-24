import * as express from "express";

import { SupplyModel } from "../models/supply";
import { ServerError, ErrorCode } from "../models/server-error";
import { logger } from "../logger";

const inventoryRouter = express.Router();

// ----------- INVENTORY ------------ //

inventoryRouter.post("/", (req, res) => {
    const newSupply = new SupplyModel({
        brand: req.body.brand,
        generic_name: req.body.generic_name,
        quantity: req.body.quantity,
        amount: req.body.amount,
        unit: req.body.unit,
        price: req.body.price
    });

    newSupply.save((error, savedSupply) => {
        if (error) {
            logger.error(`Couldn't save new supply. Error body: ${JSON.stringify(error)}`);
            return res.status(500).send(error);
        }

        return res.status(201).send(savedSupply);
    });
});

inventoryRouter.get("/", (req, res) => {
    SupplyModel.find((error, supplies) => {
        if (error) {
            logger.error(`Couldn't get supplies. Error body: ${JSON.stringify(error)}`);
            return res.status(500).send(error);
        }

        return res.send(supplies);
    });
});

export { inventoryRouter };
