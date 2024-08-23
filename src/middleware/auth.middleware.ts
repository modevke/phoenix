import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "config";
import { JwtOptions } from "../global";
import db from "../utils/db";
import { MiddlewareStrategy } from ".";

const { secretKey } = config.get<JwtOptions>("serverConfigs.jwt");

export class AuthMiddlewareStrategy implements MiddlewareStrategy {
  execute() {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!req.headers["authorization"]) {
        res.status(401).send({
          error: true,
          status: 400,
          message: "Invalid API token",
          errorCode: "API104",
          errorMessage: "Your session has expired. Please login again. ",
        });
      } else {
        const token = req.headers["authorization"].split(" ")[1];
        const data: any = jwt.verify(token, secretKey);

        const findUser = await db.User.findByPk(data.id);

        if (!findUser) {
          res.status(401).send({
            error: true,
            status: 400,
            message: `User not found or deactivated`,
            errorCode: "API101",
            errorMessage: `The user detail have not been found or has been deactivated. Please check your login details. If this persists contact us on: ${process.env.SUPPORT} with the Code: API101`,
          });
        } else {
          req["user"] = findUser.dataValues;
          next();
        }
      }
    };
  }
}
