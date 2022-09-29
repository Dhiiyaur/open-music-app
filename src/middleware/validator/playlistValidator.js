const Joi = require('joi');
const InvariantError = require('../../exceptions/invariantError');

const PostPlaylistSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'failed to add playlist. Please fill in playlist name',
    }),
});

const PostSongToPlaylistSchema = Joi.object({
    songId: Joi.string().required().messages({
        'any.required': 'failed to add song to playlist. Please fill in songid',
    }),
});

const DeleteSongFromPlaylistSchema = Joi.object({
    songId: Joi.string().required().messages({
        'any.required': 'failed to delete song in playlist. Please fill in songid',
    }),
});

const PlaylistValidator = {
    PostPlaylistPayload: (payload) => {
        const { error } = PostPlaylistSchema.validate(payload);
        if (error) {
            throw new InvariantError(error.message);
        }
    },

    PostSongToPlaylistPayload: (payload) => {
        const { error } = PostSongToPlaylistSchema.validate(payload);
        if (error) {
            throw new InvariantError(error.message);
        }
    },

    DeleteSongFromPlaylistPayload: (payload) => {
        const { error } = DeleteSongFromPlaylistSchema.validate(payload);
        if (error) {
            throw new InvariantError(error.message);
        }
    },
};

module.exports = PlaylistValidator;
