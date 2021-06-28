import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import express from 'express';
import {RequestContext} from "@mikro-orm/core";

// LOAD ENVS
dotenv.config();

// MIDDLEWARE, API IMPORT, SWAGGER DOC, DB
import api from "./api";
import {connectToDb} from './db/init';
import middlewares from "./middlewares";


// CONSTANTS
const API_VERSION = process.env.API_VERSION;
const NODE_ENV = process.env.NODE_ENV;
const MORGAN_FORMAT = NODE_ENV === "development" ? "dev" : "common";

// EXPRESS INIT
const app = express();

// EXPRESS MIDDLEWARES
app.use(morgan(MORGAN_FORMAT));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(async (req, res, next) => {
  const orm = await connectToDb();
  RequestContext.create(orm.em, next);
})

// SETUP API ROUTES
app.use(`/api/${API_VERSION}`, api);

// OTHER API ROUTES
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// EXPORTING APP
export default app;
