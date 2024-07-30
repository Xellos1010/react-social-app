// src/utils/logger.ts

const ENV = import.meta.env.VITE_ENV;

const levels = {
    VERBOSE: 'VERBOSE',
    INFO: 'INFO',
    DEBUG: 'DEBUG',
    WARN: 'WARN',
    ERROR: 'ERROR',
};

class Logger {
    private scriptName: string;

    constructor(scriptName: string) {
        this.scriptName = scriptName;
    }

    private shouldLog(level: string): boolean {
        if (ENV === 'PROD' && (level === levels.VERBOSE || level === levels.INFO || level === levels.DEBUG)) {
            return false;
        }
        return true;
    }

    public verbose(message: string, ...optionalParams: any[]) {
        if (this.shouldLog(levels.VERBOSE)) {
            console.log(`[${levels.VERBOSE}] [${this.scriptName}]`, message, ...optionalParams);
        }
    }

    public info(message: string, ...optionalParams: any[]) {
        if (this.shouldLog(levels.INFO)) {
            console.info(`[${levels.INFO}] [${this.scriptName}]`, message, ...optionalParams);
        }
    }

    public debug(message: string, ...optionalParams: any[]) {
        if (this.shouldLog(levels.DEBUG)) {
            console.debug(`[${levels.DEBUG}] [${this.scriptName}]`, message, ...optionalParams);
        }
    }

    public warn(message: string, ...optionalParams: any[]) {
        console.warn(`[${levels.WARN}] [${this.scriptName}]`, message, ...optionalParams);
    }

    public error(message: string, ...optionalParams: any[]) {
        console.error(`[${levels.ERROR}] [${this.scriptName}]`, message, ...optionalParams);
    }
}

export const createLogger = (scriptName: string): Logger => new Logger(scriptName);