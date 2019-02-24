import * as express from "express";
import * as jwt from "express-jwt";
import * as jwks from "jwks-rsa";

import { CONFIG } from "../config";
import { servicesRouter } from "./servicesAPI";
import { inventoryRouter } from "./inventoryAPI";
import { ConfigModel } from "../models/config";
import { logger } from "../logger";

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

adminRouter.get("/config", (req, res) => {
    ConfigModel.findOne({}, (err, config) => {
        if (err) {
            logger.error(`Couldn't get config. Error: ${JSON.stringify(err)}`);
            return res.status(500).send(err);
        }
        return res.send(config);
    });
});

adminRouter.use("/services", servicesRouter);
adminRouter.use("/inventory", inventoryRouter);

export { adminRouter };
