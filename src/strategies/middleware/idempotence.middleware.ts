import { Request, Response, NextFunction } from "express";
import { MiddlewareStrategy } from ".";

const idempotenceTokens: Set<string> = new Set();

export class IdempotenceMiddlewareStrategy implements MiddlewareStrategy {
  execute() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const token: string = req.params["idempotence-token"];
      if (!token) {
        return res.status(400).json({
          error: true,
          status: 400,
          message: "Idempotency token is required",
          errorCode: "API108",
          errorMessage: "Idempotency token is required",
        });
      } else {
        if (idempotenceTokens.has(token)) {
          return res.status(409).json({
            error: true,
            status: 400,
            message: "Request already processed",
            errorCode: "API109",
            errorMessage: "Request already processed",
          });
        }

        idempotenceTokens.add(token);

        // Set a timeout to expire the token
        setTimeout(() => {
          idempotenceTokens.delete(token);
        }, 2 * 60 * 60 * 1000); // Expire in 2 hours (adjust as needed)
        next();
      }
    };
  }
}
