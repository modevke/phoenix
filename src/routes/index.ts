import express, { Application, Request, Response, NextFunction } from "express";
import {userControllerRouter} from './v1/user/user.controller'

export class Routes {
  public static router(app: Application) {
    const baseAPIRouter = express.Router();

    app.use("/api", baseAPIRouter);

    baseAPIRouter.use("/user", userControllerRouter);

    // HANDLE 404
    app.use(async (req: Request, res: Response) => {
      res.status(404).send({
        error: true,
        status: 404,
        message: `Page Not Found`,
        errorCode: "EA104",
        errorMessage: `An error occurred processing your request. Please try again. If this persists contact us on: ${process.env.SUPPORT} with the Error code: EA104`,
      });
    });

    // HANDLE 500
    app.use(async (err, req: Request, res: Response, next: NextFunction) => {
      if (err.type === "entity.parse.failed") {
        return res.status(400).send({
          error: true,
          message: "Invalid JSON object",
          errorCode: "EA106",
          errorMessage: `An error occurred processing your request. Please try again. If this persists contact us on: ${process.env.SUPPORT} with the Error code: ESB104`,
        });
      }

      res.status(500).send({
        error: true,
        status: 500,
        message: `Server error`,
        errorCode: "EA107",
        errorMessage: `An error occurred processing your request. Please try again. If this persists contact us on: ${process.env.SUPPORT} with the Error code: ESB107`,
      });
    });
  }
}
