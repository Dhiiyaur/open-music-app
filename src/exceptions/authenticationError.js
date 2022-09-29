const ClientError = require('./clientError');
const responeCode = require('../utils/responeCode');

class AuthenticationError extends ClientError {
    constructor(message) {
        super(message, responeCode.UNAUTHORIZED);
        this.name = 'AuthenticationError';
    }
}

module.exports = AuthenticationError;
