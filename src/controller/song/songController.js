const autoBind = require('auto-bind');
const responeCode = require('../../utils/responeCode');
const { successResponse } = require('../../utils/responses');

class SongController {
    constructor(server, options) {
        this.server = server;
        this.songService = options.service;
        this.validator = options.validator;
        autoBind(this);
    }

    GetAllSong = async (r, h) => {
        const { title, performer } = r.query;
        const queryData = await this.songService.GetSongs(title, performer);

        return successResponse(h, {
            responseData: {
                songs: queryData,
            },
            responseCode: responeCode.OK,
        });
    };

    GetDetailSongById = async (r, h) => {
        const { id } = r.params;
        const queryData = await this.songService.GetSongById(id);
        return successResponse(h, {
            responseData: {
                song: queryData,
            },
            responseCode: responeCode.OK,
        });
    };

    PostSong = async (r, h) => {
        this.validator.PostSongPayload(r.payload);
        const songId = await this.songService.AddSong(r.payload);

        return successResponse(h, {
            responseData: {
                songId,
            },
            responseCode: responeCode.CREATED,
        });
    };

    EditSongById = async (r, h) => {
        this.validator.EditSongPayload(r.payload);

        const { id } = r.params;
        const songName = await this.songService.EditSong(id, r.payload);

        return successResponse(h, {
            responseMessage: `successfully updated ${songName}`,
            responseCode: responeCode.OK,
        });
    };

    DeleteSongById = async (r, h) => {
        const { id } = r.params;
        const songName = await this.songService.DeleteSong(id, r.payload);

        return successResponse(h, {
            responseMessage: `successfully delete ${songName}`,
            responseCode: responeCode.OK,
        });
    };
}

module.exports = SongController;
