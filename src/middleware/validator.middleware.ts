import Ajv from "ajv";
import addFormats from "ajv-formats";
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

import { Request, Response, NextFunction } from "express";
import { MiddlewareStrategy } from ".";

export class ValidationMiddlewareStrategy implements MiddlewareStrategy {
  private schema: any;

  constructor(schema: any) {
    this.schema = schema;
  }

  execute() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const validateBody = ajv.compile(this.schema);
      if (!ajv.validate(this.schema, req.body)) {
        res.status(400).send({
          error: true,
          status: 400,
          message: "Validation Error",
          errorCode: "API100",
          errorMessage: `An error occurred validating your request.`,
          res: validateBody.errors.map((error) => {
            return {
              message: error.message,
              path: error.instancePath.substring(1),
            };
          }),
        });
      } else {
        next();
      }

      
    };
  }
}
