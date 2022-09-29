const Joi = require('joi');
const InvariantError = require('../../exceptions/invariantError');

const PostExportSchema = Joi.object({
    targetEmail: Joi.string().required().messages({
        'any.required': 'failed to export playlist. Please fill an email',
    }),
});

const AlbumValidator = {
    PostExportPayload: (payload) => {
        const { error } = PostExportSchema.validate(payload);
        if (error) {
            throw new InvariantError(error.message);
        }
    },

};

module.exports = AlbumValidator;
