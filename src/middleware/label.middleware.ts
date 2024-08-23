import { Request, Response, NextFunction } from "express";
import { MiddlewareStrategy } from ".";

export class LabelMiddlewareStrategy implements MiddlewareStrategy {

    private label: string;

    constructor(label: string){
        this.label = label;
    }

    execute() {
        return async (req: Request, res: Response, next: NextFunction) => {
            req['apiLabel'] = this.label
            next()
        }
    }
}