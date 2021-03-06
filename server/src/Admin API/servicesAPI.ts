import * as express from "express";

import { ServiceModel, IService } from "../models/service";
import { ServerError, ErrorCode } from "../models/server-error";
import { logger } from "../logger";

const servicesRouter = express.Router();

// ----------- SERVICES ------------ //

servicesRouter.post("/", (req, res) => {
    const newService = new ServiceModel({
        code: req.body.code.toLowerCase(),
        name: req.body.name,
        description: req.body.description,
        additional: req.body.additional,
        price: req.body.price
    });

    ServiceModel.findOne()
        .sort("-value")
        .exec((err: Error, service) => {
            if (err) {
                logger.error(`Error finding service! Error: ${err.name} - ${err.message}`);
                return res.status(500).send({ err });
            }

            if (!service) {
                newService.value = 1;
            } else {
                newService.value = service.value * 2;
            }

            newService.save((error, savedService) => {
                if (error) {
                    if (error.code === 11000) {
                        return res
                            .status(400)
                            .send(
                                new ServerError(
                                    "Duplicate code",
                                    `The code '${newService.code}' is already being used by another service.`,
                                    ErrorCode.SERVICE_DUPLICATE_CODE
                                )
                            );
                    } else {
                        logger.error(`Full error: ${JSON.stringify(error)}`);
                        return res.status(500).send({ error });
                    }
                }
                return res.status(201).send(savedService);
            });
        });
});

servicesRouter.get("/", (req, res) => {
    ServiceModel.find((err: Error, services: IService[]) => {
        if (err) {
            logger.error(`Error finding services. Error: ${err.name} - ${err.message}`);
            return res.status(500).send({ message: err.message });
        }

        return res.send(services);
    });
});

servicesRouter.get("/:code", (req, res) => {
    ServiceModel.findOne({ code: req.params.code }, (error: Error, service) => {
        if (error) {
            logger.error(`Error finding service. Error: ${JSON.stringify(error)}`);
            return res.status(500).send({ error: error });
        }

        if (!service) {
            return res
                .status(404)
                .send(
                    new ServerError(
                        "Service not found",
                        `The service of code '${req.params.code}' could not be found.`,
                        ErrorCode.SERVICE_CODE_NOT_FOUND
                    )
                );
        }
        return res.send(service);
    });
});

servicesRouter.put("/:code", (req, res) => {
    ServiceModel.findOne({ code: req.params.code }, (error: Error, service) => {
        if (error) {
            logger.error(`Error finding service. Error: ${JSON.stringify(error)}`);
            return res.status(500).send({ error: error });
        }

        if (!service) {
            return res.status(404).send({
                error: {
                    name: "Service not found",
                    message: `The service of code '${req.params.code}' could not be found.`
                }
            });
        }

        service.code = req.body.code.toLowerCase();
        service.name = req.body.name;
        service.description = req.body.description;
        service.price = req.body.price;
        service.additional = req.body.additional;

        service.save((err, savedService) => {
            if (err) {
                if (err.code === 11000) {
                    return res
                        .status(400)
                        .send(
                            new ServerError(
                                "Duplicate code",
                                `The code '${service.code}' is already being used by another service.`,
                                ErrorCode.SERVICE_DUPLICATE_CODE
                            )
                        );
                }
                logger.error(`Error updating service. Error: ${JSON.stringify(err)}`);
                return res.status(500).send({ error: err });
            }
            return res.send(savedService);
        });
    });
});

export { servicesRouter };
