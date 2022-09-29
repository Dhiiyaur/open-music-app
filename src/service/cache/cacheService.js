class CacheService {
    constructor(redisClient) {
        this.redisClient = redisClient;
    }

    Set = async (key, value, expirationInSecond = 1800) => {
        await this.redisClient.set(key, value, {
            EX: expirationInSecond,
        });
    };

    Get = async (key) => {
        const get = await this.redisClient.get(key);
        return get;
    };

    Delete = async (key) => {
        await this.redisClient.del(key);
    };
}

module.exports = CacheService;
