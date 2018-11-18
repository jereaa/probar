import * as express from "express";
import * as jwt from "express-jwt";
import * as jwks from "jwks-rsa";

import { ServiceModel } from "./models/service";
import { CONFIG } from "./config";

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

const adminCheck = ((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const roles = req.user[CONFIG.AUTH0_AUDIENCE].roles || [];
    if (roles.indexOf("admin") !== -1) {
        next();
    } else {
        res.status(401).send({ message: "Not authorized for admin access" });
    }
});

adminRouter.use(jwtCheck, adminCheck);

adminRouter.get("/", (req, res) => {
    res.send({ message: "Admin API is up!" });
});


// ----------- SERVICE ------------ //

adminRouter.post("/service/new", (req, res) => {
    const newService = new ServiceModel({
        code: req.body.code,
        name: req.body.name,
        additional: req.body.additional,
        price: req.body.price
    });
    newService.save((err: Error) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        return res.send(newService);
    });
});

export { adminRouter };
