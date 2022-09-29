const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/invariantError');
const config = require('./config');

const TokenManager = {
    generateAccessToken: (payload) => Jwt.token.generate(payload, config.security.access_token_key),
    generateRefreshToken: (payload) => Jwt.token.generate(payload, config.security.refresh_token_key),
    verifyRefreshToken: (refreshToken) => {
        try {
            const artifacts = Jwt.token.decode(refreshToken);
            Jwt.token.verifySignature(artifacts, config.security.refresh_token_key);
            const { payload } = artifacts.decoded;
            return payload;
        } catch (error) {
            throw new InvariantError('Refresh token invalid');
        }
    },
};

module.exports = TokenManager;
