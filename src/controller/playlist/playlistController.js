const autoBind = require('auto-bind');
const NotFoundError = require('../../exceptions/notFoundError');
const responeCode = require('../../utils/responeCode');
const { successResponse } = require('../../utils/responses');

class PlaylistController {
    constructor(server, options) {
        this.server = server;
        this.playlistService = options.service.playlistService;
        this.songService = options.service.songService;
        this.collaborationService = options.service.collaborationService;
        this.validator = options.validator;
        autoBind(this);
    }

    GetAllPlaylist = async (r, h) => {
        const { id: userId } = r.auth.credentials;
        const playlists = await this.playlistService.GetPlaylist(userId);
        return successResponse(h, {
            responseData: {
                playlists,
            },
            responseCode: responeCode.OK,
        });
    };

    PostPlaylist = async (r, h) => {
        this.validator.PostPlaylistPayload(r.payload);
        const { id: userId } = r.auth.credentials;
        const playlistId = await this.playlistService.AddPlaylist(r.payload, userId);
        return successResponse(h, {
            responseData: {
                playlistId,
            },
            responseCode: responeCode.CREATED,
        });
    };

    DeletePlaylist = async (r, h) => {
        const { id: playlistId } = r.params;
        const { id: userId } = r.auth.credentials;

        await this.playlistService.VerifyPlaylistOwner(userId, playlistId);
        await this.playlistService.DeletePlaylist(playlistId);

        return successResponse(h, {
            responseMessage: 'success delete playlist',
            responseCode: responeCode.OK,
        });
    };

    PostSongToPlaylist = async (r, h) => {
        this.validator.PostSongToPlaylistPayload(r.payload);
        const { id: playlistId } = r.params;
        const { id: userId } = r.auth.credentials;
        const { songId } = r.payload;

        const queryDataSong = await this.songService.GetSongById(songId);

        try {
            await this.playlistService.VerifyPlaylistOwner(userId, playlistId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            await this.playlistService.VerifyPlaylistAccess(userId, playlistId);
        }

        await this.playlistService.AddSongToPlaylist(songId, playlistId);
        await this.playlistService.AddPlaylistActivities('add', { playlistId, songId, userId });

        return successResponse(h, {
            responseMessage: `success add ${queryDataSong.title} to playlist`,
            responseCode: responeCode.CREATED,
        });
    };

    GetPlaylistById = async (r, h) => {
        const { id: playlistId } = r.params;
        const { id: userId } = r.auth.credentials;

        try {
            await this.playlistService.VerifyPlaylistOwner(userId, playlistId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            await this.playlistService.VerifyPlaylistAccess(userId, playlistId);
        }

        const queryPlaylistById = await this.playlistService.GetPlaylistById(playlistId);
        const queryPlaylistSongs = await this.songService.GetSongsByPlaylistId(playlistId);

        return successResponse(h, {
            responseData: {
                playlist: {
                    ...queryPlaylistById,
                    songs: queryPlaylistSongs,
                },
            },
            responseCode: responeCode.OK,
        });
    };

    DeleteSongFromPlaylist = async (r, h) => {
        this.validator.DeleteSongFromPlaylistPayload(r.payload);

        const { id: playlistId } = r.params;
        const { id: userId } = r.auth.credentials;
        const { songId } = r.payload;

        try {
            await this.playlistService.VerifyPlaylistOwner(userId, playlistId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            await this.playlistService.VerifyPlaylistAccess(userId, playlistId);
        }

        await this.playlistService.DeleteSongFromPlaylistBySongId(songId);
        await this.playlistService.AddPlaylistActivities('delete', { playlistId, songId, userId });

        return successResponse(h, {
            responseMessage: 'success delete from playlist',
            responseCode: responeCode.OK,
        });
    };

    GetActivitiesById = async (r, h) => {
        const { id: playlistId } = r.params;
        const { id: userId } = r.auth.credentials;

        try {
            await this.playlistService.VerifyPlaylistOwner(userId, playlistId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            await this.playlistService.VerifyPlaylistAccess(userId, playlistId);
        }

        const queryPlaylistActivities = await this.playlistService.GetPlaylistActivities(playlistId);

        return successResponse(h, {
            responseData: {
                playlistId,
                activities: queryPlaylistActivities,
            },
            responseCode: responeCode.OK,
        });
    };
}

module.exports = PlaylistController;
