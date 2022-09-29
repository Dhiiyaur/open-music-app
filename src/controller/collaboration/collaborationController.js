const autoBind = require('auto-bind');
const responeCode = require('../../utils/responeCode');
const { successResponse } = require('../../utils/responses');

class CollaborationController {
    constructor(server, options) {
        this.server = server;
        this.validator = options.validator;
        this.userService = options.service.userService;
        this.collaborationService = options.service.collaborationService;
        this.playlistService = options.service.playlistService;
        autoBind(this);
    }

    PostAddCollaboration = async (r, h) => {
        this.validator.PostCollaborationPayload(r.payload);
        const { id } = r.auth.credentials;
        const { playlistId, userId } = r.payload;
        await this.userService.CheckUserId(userId);
        await this.playlistService.VerifyPlaylistOwner(id, playlistId);
        const collaborationId = await this.collaborationService.AddCollaboration(playlistId, userId);

        return successResponse(h, {
            responseData: {
                collaborationId,
            },
            responseCode: responeCode.CREATED,
        });
    };

    DeleteCollaboration = async (r, h) => {
        this.validator.PostCollaborationPayload(r.payload);
        const { id } = r.auth.credentials;
        const { playlistId, userId } = r.payload;

        await this.playlistService.VerifyPlaylistOwner(id, playlistId);
        await this.collaborationService.DeleteCollaboration(playlistId, userId);

        return successResponse(h, {
            responseMessage: 'success delete collaboration',
            responseCode: responeCode.OK,
        });
    };
}

module.exports = CollaborationController;
