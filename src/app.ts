import * as express from "express";
import { env } from "./env";
import { setDiscoveryClientRouter } from "./routes/discovery-client.route";
import { setAJsonRoute } from "./routes/a-json.route";
import { IExpressError } from "./interfaces/IExpressError";
//import { MikroORM, ReflectMetadataProvider } from "mikro-orm";
import { MongoDriver } from '@mikro-orm/mongodb';
import { IExpressRequest } from "./interfaces/IExpressRequest";
import entities from "./entities/";
import * as bodyParser from "body-parser";
// import {MongoClient} from "mongodb";
import {ReflectMetadataProvider, MikroORM} from "@mikro-orm/core";
export { makeApp };

// const url = 'mongodb://localhost:27017';


let app: express.Application;


async function makeApp(): Promise<express.Application> {
    if (app) return app;
   
    // const client = new MongoClient(url);
    // await client.connect();
    
    app = express();
  
    const orm = await MikroORM.init<MongoDriver>({
        metadataProvider: ReflectMetadataProvider,
        cache: { enabled: false },
        entities: entities,
        dbName: env.DB_NAME,
        clientUrl: env.MONGO_URL,
        type: "mongo"
    });
    
     // make the entity manager available in request
     app.use((req: IExpressRequest, _res: express.Response, next: express.NextFunction) => {
        req.em = orm.em.fork();
        next();
    });
    
    // middleware
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json()); 

    // routes
    app.use(env.DISCOVERY_CLIENT_ROUTE, setDiscoveryClientRouter(express.Router()));
    app.use(env.A_JSON_ROUTE, setAJsonRoute(express.Router()));

    // 404
    app.use((_req: express.Request, _res: express.Response, next: express.NextFunction) => {
        const err = new Error("Not Found") as IExpressError;
        err.status = 404;
        next(err);
    });

    // 500
    app.use((err: IExpressError, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        res.status(err.status || 500).send(env.NODE_ENV === "development" ? err : {});
    });

    return app;
}