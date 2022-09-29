const Joi = require('joi');
const InvariantError = require('../../exceptions/invariantError');

const currentYear = new Date().getFullYear();

const PostAlbumSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'failed to add album. Please fill in album name',
    }),
    year: Joi.number().integer().min(100).max(currentYear)
        .required()
        .messages({
            'any.required': 'failed to add album. Please fill in album year',
        }),
});

const EditAlbumSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'failed to edit album. Please fill in album name',
    }),
    year: Joi.number().integer().min(1700).max(currentYear)
        .required()
        .messages({
            'any.required': 'failed to edit album. Please fill in album year',
        }),
});

const PostAlbumCoverSchema = Joi.object({
    'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp').required(),
}).unknown();

const AlbumValidator = {
    PostAlbumPayload: (payload) => {
        const { error } = PostAlbumSchema.validate(payload);
        if (error) {
            throw new InvariantError(error.message);
        }
    },

    EditAlbumPayload: (payload) => {
        const { error } = EditAlbumSchema.validate(payload);
        if (error) {
            throw new InvariantError(error.message);
        }
    },

    PostAlbumCoverPayload: (payload) => {
        const { error } = PostAlbumCoverSchema.validate(payload);
        if (error) {
            throw new InvariantError(error.message);
        }
    },
};

module.exports = AlbumValidator;
