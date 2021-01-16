const {EventHubClient} = require("@azure/event-hubs");

// @ts-ignore
export interface LoggerStrategy {
    log(data: any): void;
}

// @ts-ignore
export class ConsoleLogger implements LoggerStrategy {
    public log(data: any) {
        const dataString = JSON.stringify(data);
        console.log(dataString);
    }
}

// @ts-ignore
export class EventHubsLogger implements LoggerStrategy {
    readonly CONNECTION_STRING = "INSERT YOUR EVENT HUBS CONNECTION STRING-PRIMARY KEY HERE";
    readonly EVENT_HUB_NAME = "INSERT YOU EVENT HUB INSTANCE NAME HERE";
    private client: any;

    constructor() { 
        this.client = EventHubClient.createFromConnectionString(this.CONNECTION_STRING, this.EVENT_HUB_NAME);
    }

    public async disconnect() {
        await this.client.close();
    }

    public async log(data: any) {
        //const dataString = JSON.stringify(data);
        const eventData = {body: data};
        console.log(`Sending message: ${JSON.stringify(eventData.body).slice(0, 30)}`);
        try {
            await this.client.send(eventData);
        } catch (err) {
            throw err;
        }
    }
}
