const ClientError = require('./clientError');
const responeCode = require('../utils/responeCode');

class AuthorizationError extends ClientError {
    constructor(message) {
        super(message, responeCode.FORBIDDEN);
        this.name = 'AuthorizationError';
    }
}

module.exports = AuthorizationError;
