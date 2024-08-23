class Logger {
    private static instance: Logger;

    private constructor() {
        // Private constructor to prevent direct instantiation
    }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    log(message: string): void {
        console.log(`Log: ${message}`);
    }

    error(message: string): void {
        console.log(`Error: ${message}`);
    }
}


export const Log =  Logger.getInstance();