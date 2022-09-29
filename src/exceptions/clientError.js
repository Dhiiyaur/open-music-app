const responeCode = require('../utils/responeCode');

class ClientError extends Error {
    constructor(message, statusCode = responeCode.BAD_REQUEST) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ClientError';
    }
}

module.exports = ClientError;
