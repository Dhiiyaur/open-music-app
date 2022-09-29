const Joi = require('joi');
const InvariantError = require('../../exceptions/invariantError');

const currentYear = new Date().getFullYear();

const PostSongSchema = Joi.object({
    title: Joi.string().required().messages({
        'any.required': 'failed to add song. Please fill in song title',
    }),
    year: Joi.number().integer().min(1700).max(currentYear)
        .required()
        .messages({
            'any.required': 'failed to add song. Please fill in song year',
        }),
    genre: Joi.string().required().messages({
        'any.required': 'failed to add song. Please fill in song genre',
    }),
    performer: Joi.string().required().messages({
        'any.required': 'failed to add song. Please fill in song performer',
    }),
    duration: Joi.number(),
    albumId: Joi.string(),
});

const EditSongSchema = Joi.object({
    title: Joi.string().required().messages({
        'any.required': 'failed to edit song. Please fill in song title',
    }),
    year: Joi.number().integer().min(1700).max(currentYear)
        .required()
        .messages({
            'any.required': 'failed to edit song. Please fill in song year',
        }),
    genre: Joi.string().required().messages({
        'any.required': 'failed to edit song. Please fill in song genre',
    }),
    performer: Joi.string().required().messages({
        'any.required': 'failed to edit song. Please fill in song performer',
    }),
    duration: Joi.number(),
    albumId: Joi.string(),
});

const SongValidator = {
    PostSongPayload: (payload) => {
        const { error } = PostSongSchema.validate(payload);
        if (error) {
            throw new InvariantError(error.message);
        }
    },

    EditSongPayload: (payload) => {
        const { error } = EditSongSchema.validate(payload);
        if (error) {
            throw new InvariantError(error.message);
        }
    },
};

module.exports = SongValidator;
