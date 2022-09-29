const redis = require('redis');

let redisClient;

(async () => {
    redisClient = redis.createClient({
        socket: {
            host: process.env.REDIS_SERVER,
        },
    });
    redisClient.on('error', (error) => console.error(`Error : ${error}`));
    await redisClient.connect();
})();

module.exports = redisClient;
