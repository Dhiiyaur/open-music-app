const autoBind = require('auto-bind');
const responeCode = require('../../utils/responeCode');
const { successResponse } = require('../../utils/responses');
const NotFoundError = require('../../exceptions/notFoundError');

class ExportController {
    constructor(server, options) {
        this.server = server;
        this.playlistService = options.service.playlistService;
        this.songService = options.service.songService;
        this.exportService = options.service.exportService;
        this.validator = options.validator;
        autoBind(this);
    }

    PostExportPlaylistById = async (r, h) => {
        this.validator.PostExportPayload(r.payload);

        const { id: userId } = r.auth.credentials;
        const { playlistId } = r.params;

        try {
            await this.playlistService.VerifyPlaylistOwner(userId, playlistId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            await this.playlistService.VerifyPlaylistAccess(userId, playlistId);
        }

        const data = {
            playlistId,
            targetEmail: r.payload.targetEmail,
        };

        await this.exportService.sendQueue('export:user-playlist', JSON.stringify(data));

        return successResponse(h, {
            responseMessage: 'Permintaan Anda sedang kami proses',
            responseCode: responeCode.CREATED,
        });
    };
}

module.exports = ExportController;
