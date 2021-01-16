
const redis = require("redis");
const bluebird = require("bluebird");

// Convert Redis client API to use promises, to make it usable with async/await syntax
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// @ts-ignore
export interface ICacheService {
    cache(key: string, status: string): Promise<void>;
}

// keys *
// scan 0 count 10
// flushall

// @ts-ignore
export class FetchCacheService implements ICacheService {
    readonly PORT = 6380;
    readonly NAMESPACE = 'INSERT YOUR AZURE CACHE FOR REDIS HOST NAME HERE';
    readonly CONNECTION_OPTIONS = {
        auth_pass: 'INSERT YOUR AZURE CACHE FOR REDIS PRIMARY KEY HERE',
        tls: {servername: this.NAMESPACE}
    };
    private client: any;

    constructor() {
        // Connect to the Azure Cache for Redis over the TLS port using the key.
        this.client = redis.createClient(this.PORT, this.NAMESPACE, this.CONNECTION_OPTIONS);
    }

    // @ts-ignore
    private async get(key: string): Promise<any> {
        return this.client.getAsync(key);
    }

    // @ts-ignore
    private async isFetched(key: string): Promise<boolean> {
        const searchString = `${key}-completed`;
        const record = await this.get(searchString);
        return !!record;
    }

    // @ts-ignore
    private async set(key: string, value: string) {
        await this.client.setAsync(key, value);
    }

    public async cache(key: string, status: string): Promise<void> {
        const isFetched = await this.isFetched(key);
        const timestamp = `${Date.now()}`;

        if (isFetched) {
            const keyString = `${key}-duplicate`;
            await this.set(keyString, timestamp);
            throw new Error(`${key} Duplicate!`);
        } else {
            const keyString = `${key}-${status}`;
            await this.set(keyString, timestamp);
        }
    }

  
}
