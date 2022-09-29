const ClientError = require('./clientError');
const responeCode = require('../utils/responeCode');

class InvariantError extends ClientError {
    constructor(message) {
        super(message, responeCode.BAD_REQUEST);
        this.name = 'InvariantError';
    }
}

module.exports = InvariantError;
