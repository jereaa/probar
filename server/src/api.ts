import * as express from "express";
import * as jwt from "express-jwt";
import * as jwks from "jwks-rsa";

import { ServiceModel, IService } from "./models/service";
import { CONFIG } from "./config";
import { ServerError, ErrorCode } from "./models/server-error";

const adminRouter = express.Router();

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${CONFIG.AUTH0_ISSUER}.well-known/jwks.json`
    }),
    audience: "https://probar-barras.com/api",
    issuer: CONFIG.AUTH0_ISSUER,
    algorithms: ["RS256"]
});

const adminCheck = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const roles = req.user[CONFIG.AUTH0_AUDIENCE].roles || [];
    if (roles.indexOf("admin") !== -1) {
        next();
    } else {
        res.status(401).send({ message: "Not authorized for admin access" });
    }
};

adminRouter.use(jwtCheck, adminCheck);

adminRouter.get("/", (req, res) => {
    res.send({ message: "Admin API is up!" });
});

// ----------- SERVICES ------------ //

adminRouter.post("/services", (req, res) => {
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
                console.error(`Error finding service! Error: ${err.name} - ${err.message}`);
                return res.status(500).send({ message: err.message });
            }

            if (!service) {
                newService.value = 1;
            } else {
                newService.value = service.value * 2;
            }

            newService.save((error) => {
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
                        console.error(`Full error: ${JSON.stringify(error)}`);
                        return res.status(500).send({ error });
                    }
                }
                return res.status(201).send(newService);
            });
        });
});

adminRouter.get("/services", (req, res) => {
    ServiceModel.find((err: Error, services: IService[]) => {
        if (err) {
            console.error(`Error finding services. Error: ${err.name} - ${err.message}`);
            return res.status(500).send({ message: err.message });
        }

        return res.send(services);
    });
});

adminRouter.get("/services/:code", (req, res) => {
    ServiceModel.findOne({ code: req.params.code }, (error: Error, service) => {
        if (error) {
            console.error(`Error finding service. Error: ${JSON.stringify(error)}`);
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

adminRouter.put("/services/:code", (req, res) => {
    ServiceModel.findOne({ code: req.params.code }, (error: Error, service) => {
        if (error) {
            console.error(`Error finding service. Error: ${JSON.stringify(error)}`);
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
                console.error(`Error updating service. Error: ${JSON.stringify(err)}`);
                return res.status(500).send({ error: err });
            }
            return res.send(savedService);
        });
    });
});

export { adminRouter };
