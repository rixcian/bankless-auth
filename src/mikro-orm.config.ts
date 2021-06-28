import dotenv from "dotenv"
import {TsMorphMetadataProvider} from "@mikro-orm/reflection";
import {Configuration, Connection, IDatabaseDriver, Options} from "@mikro-orm/core";

// LOAD ENVS
dotenv.config();

const config:  Configuration<IDatabaseDriver<Connection>> | Options<IDatabaseDriver<Connection>> = {
  entities: ['./dist/db/entities/*.js'],
  entitiesTs: ['./src/db/entities/*.ts'],
  metadataProvider: TsMorphMetadataProvider,
  // @ts-ignore
  type: process.env.DB_TYPE,
  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  migrations: {
    path: './src/db/migrations', // path to the folder with migrations
  }
}

export default config;