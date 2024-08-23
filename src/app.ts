import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express'
import config from 'config';
import {Log} from './utils/common/logger'
import { ServerConfig } from "./global";
import {Routes} from './routes'
require("express-async-errors");

const { host, port, corsOptions, docs, fileLimits } = config.get<ServerConfig>('serverConfigs');

class Server {

   public app: Application

  constructor() {
    this.app = express();
    this.config()
  }

  private config(): void {
   this.app.disable("etag").disable("x-powered-by");
   this.app.use(
      cors({
        origin: corsOptions.origins,
        methods: corsOptions.methods
      })
    );
    this.app.use(helmet({ contentSecurityPolicy: false }));
    this.app.use(express.json({limit:fileLimits.jsonLimit}));
    this.app.use(express.urlencoded({ extended: true, limit:fileLimits.bodyParserLimit }));

    if(docs.show){
      this.app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJSDoc(docs.options)))
    }
  }

}

const server = new Server()
Routes.router(server.app)

server.app.listen(port, host, function () {
    Log.log(`Server is running on port ${port}.`)
}).on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
        Log.error(`Error: address already in use`)
    } else {
        Log.error(err)
    }
})