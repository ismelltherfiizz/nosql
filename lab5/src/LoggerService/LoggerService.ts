import {LoggerStrategy} from "./LoggerStrategy";

class MyLoggerService {
    private strategy: LoggerStrategy;

    constructor(strategy: LoggerStrategy) {
        this.strategy = strategy;
    }

    public setStrategy(strategy: LoggerStrategy) {
        this.strategy = strategy;
    }
    

    public async log(data: any): Promise<void> {
        return this.strategy.log(data);
    }
}

// @ts-ignore
export default MyLoggerService;