const Joi = require('joi');
const InvariantError = require('../../exceptions/invariantError');

const PostCollaborationSchema = Joi.object({
    playlistId: Joi.string().required().messages({
        'any.required': 'failed to add collaborator. Please fill in playlistId',
    }),
    userId: Joi.string().required().messages({
        'any.required': 'failed to add collaborator. Please fill in UserId',
    }),
});

const DeleteCollaborationSchema = Joi.object({
    playlistId: Joi.string().required().messages({
        'any.required': 'failed to delete collaborator. Please fill in playlistId',
    }),
    userId: Joi.string().required().messages({
        'any.required': 'failed to delete collaborator. Please fill in UserId',
    }),
});

const CollaborationValidator = {
    PostCollaborationPayload: (payload) => {
        const { error } = PostCollaborationSchema.validate(payload);
        if (error) {
            throw new InvariantError(error.message);
        }
    },

    DeleteCollaborationPayload: (payload) => {
        const { error } = DeleteCollaborationSchema.validate(payload);
        if (error) {
            throw new InvariantError(error.message);
        }
    },

};

module.exports = CollaborationValidator;
