const ClientError = require('./clientError');
const responeCode = require('../utils/responeCode');

class NotFoundError extends ClientError {
    constructor(message) {
        super(message, responeCode.NOT_FOUND);
        this.name = 'NotFoundError';
    }
}

module.exports = NotFoundError;
