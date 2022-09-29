const Joi = require('joi');
const InvariantError = require('../../exceptions/invariantError');

const AuthenticationsLoginSchema = Joi.object({
    username: Joi.string().required().messages({
        'any.required': 'failed to authentications user. Please fill in authentications username',
    }),
    password: Joi.string().required().messages({
        'any.required': 'failed to authentications user. Please fill in authentications password',
    }),
});

const AuthenticationsRefeshTokenSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        'any.required': 'failed to refresh token. Please fill in refresh token',
    }),
});

const AuthenticationsDeleteTokenSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        'any.required': 'failed to delete token. Please fill in refresh token',
    }),
});

const AuthenticationValidator = {
    LoginUserPayload: (payload) => {
        const { error } = AuthenticationsLoginSchema.validate(payload);
        if (error) {
            throw new InvariantError(error.message);
        }
    },
    RefreshTokenPayload: (payload) => {
        const { error } = AuthenticationsRefeshTokenSchema.validate(payload);
        if (error) {
            throw new InvariantError(error.message);
        }
    },
    DeleteTokenPayload: (payload) => {
        const { error } = AuthenticationsDeleteTokenSchema.validate(payload);
        if (error) {
            throw new InvariantError(error.message);
        }
    },
};

module.exports = AuthenticationValidator;
