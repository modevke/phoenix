import { AuthMiddlewareStrategy } from "./auth.middleware"
import { IdempotenceMiddlewareStrategy } from "./idempotence.middleware"
import { LabelMiddlewareStrategy } from "./label.middleware"
import { ValidationMiddlewareStrategy } from "./validator.middleware"

export interface MiddlewareStrategy {
    execute(): any
}

class Middleware {
    private ms: Array<MiddlewareStrategy> = []

    constructor(ms: Array<MiddlewareStrategy>) {
        this.ms = ms
    }

    addMs(s: MiddlewareStrategy) {
        this.ms.push()
    }

    run(){
        return this.ms.map(el => el => el.execute())
    }

}

type MiddlewareExecutions = {
    auth: boolean;
    permission?: string;
    label: string;
    idempotence?: boolean;
    validation?: any;
}

export function executeMiddleware( data: MiddlewareExecutions){
    const m = new Middleware([
        new LabelMiddlewareStrategy(data.label)
    ])
    if(data.auth){
        m.addMs(new AuthMiddlewareStrategy())
    }
    if(data.permission){
        // Will ADD permission
    }
    if(data.validation) {
        m.addMs(new ValidationMiddlewareStrategy(data.validation))
    }
    if(data.idempotence){
        m.addMs(new IdempotenceMiddlewareStrategy())
    }
    return m.run()
}



