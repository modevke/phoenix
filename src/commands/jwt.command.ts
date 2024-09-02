import { error } from "ajv/dist/vocabularies/applicator/dependencies";
import { Command } from ".";
import { CommandResponses, JwtOptions } from "../global";
import config from "config";
import jwt from "jsonwebtoken";

const { secretKey, expiresIn, refreshExpiresIn, refreshSecretKey } =
  config.get<JwtOptions>("serverConfigs.jwt");

export class JWTCreateCommand implements Command {
  payload: any;

  constructor(payload: any) {
    this.payload = payload;
  }

  execute(): CommandResponses {
    try {
      const token = jwt.sign(this.payload, secretKey, {
        expiresIn: expiresIn,
      });
      const refreshToken = jwt.sign(this.payload, refreshSecretKey, {
        expiresIn: refreshExpiresIn,
      });

      return {
        continue: true,
        error: false,
        data: {
          token,
          refreshToken,
        },
      };
    } catch (error) {
      return {
        error: true,
        continue: false,
        message: `Error generating token`,
        errorCode: "API102",
        errorMessage:
          "Error when generating tokens. Error code API103",
      };
    }
  }
}
