const Joi = require('joi');
const InvariantError = require('../../exceptions/invariantError');

const UserAddSchema = Joi.object({
    username: Joi.string().max(50).required().messages({
        'any.required': 'failed to add user. Please fill in user username',
    }),
    password: Joi.string().required().messages({
        'any.required': 'failed to add user. Please fill in user password',
    }),
    fullname: Joi.string().required().messages({
        'any.required': 'failed to add user. Please fill in user fullname',
    }),
});

const UserValidator = {
    AddUserPayload: (payload) => {
        const { error } = UserAddSchema.validate(payload);
        if (error) {
            throw new InvariantError(error.message);
        }
    },
};

module.exports = UserValidator;
