import { Request, Response, NextFunction } from "express";
import { MiddlewareStrategy } from ".";

class PermissionMiddleware implements MiddlewareStrategy{

    private permission: string;


    constructor(permission: string) {
        this.permission = permission;
    }

    execute() {
        return async (req: Request, res: Response, next: NextFunction) => {
            // if (!req.permissions) {

            // }
            next()
        }
    }

}