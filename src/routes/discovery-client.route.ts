import * as express from "express";
import { Router } from "express";
import { env } from "../env";

// const discoveryClientRouter = express.Router();

// export { discoveryClientRouter };


// discoveryClientRouter.get("/", getdiscoveryClient);

export function setDiscoveryClientRouter(router: Router): Router {

    router.get("/", getdiscoveryClient);

    return router;

}

function getdiscoveryClient(_req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const clientSettings = {
            jsonRoute: env.A_JSON_ROUTE
        };
        return res.json(clientSettings);
    } catch (ex) {
        return next(ex);
    }
}