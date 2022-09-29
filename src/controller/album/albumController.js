const autoBind = require('auto-bind');
const responeCode = require('../../utils/responeCode');
const { successResponse } = require('../../utils/responses');

class AlbumController {
    constructor(server, options) {
        this.server = server;
        this.albumService = options.service.albumService;
        this.songService = options.service.songService;
        this.validator = options.validator;
        this.folderPath = options.service.folderPath;
        autoBind(this);
    }

    GetAllAlbums = async (r, h) => {
        const queryData = await this.songService.GetAlbums();
        return successResponse(h, {
            responseData: {
                albums: queryData,
            },
            responseCode: responeCode.OK,
        });
    };

    GetDetailAlbumById = async (r, h) => {
        const { id } = r.params;
        const queryDataAlbum = await this.albumService.GetAlbumById(id);
        const queryDataSongs = await this.songService.GetSongByAlbumId(id);

        return successResponse(h, {
            responseData: {
                album: { ...queryDataAlbum, songs: queryDataSongs },
            },
            responseCode: responeCode.OK,
        });
    };

    PostAlbum = async (r, h) => {
        this.validator.PostAlbumPayload(r.payload);
        const albumId = await this.albumService.AddAlbum(r.payload);

        return successResponse(h, {
            responseData: {
                albumId,
            },
            responseCode: responeCode.CREATED,
        });
    };

    EditAlbumById = async (r, h) => {
        this.validator.EditAlbumPayload(r.payload);
        const { id } = r.params;
        const albumName = await this.albumService.EditAlbum(id, r.payload);

        return successResponse(h, {
            responseMessage: `successfully updated ${albumName}`,
            responseCode: responeCode.OK,
        });
    };

    DeleteAlbum = async (r, h) => {
        const { id } = r.params;
        const albumName = await this.albumService.DeleteAlbum(id);
        return successResponse(h, {
            responseMessage: `successfully delete ${albumName}`,
            responseCode: responeCode.OK,
        });
    };

    PostAlbumCover = async (r, h) => {
        const { id } = r.params;
        const { cover } = r.payload;
        this.validator.PostAlbumCoverPayload(cover.hapi.headers);
        const filename = await this.albumService.WriteAlbumImage(cover, cover.hapi);
        await this.albumService.AddAlbumCover(filename, id);
        return successResponse(h, {
            responseMessage: 'success update cover album',
            responseCode: responeCode.CREATED,
        });
    };

    GetAlbumCover = async (r, h) => {
        const { imageId } = r.params;
        return h.file(`${this.folderPath}/${imageId}`);
    };

    GetAlbumLikesById = async (r, h) => {
        const { id: albumId } = r.params;
        const dataQuery = await this.albumService.GetAlbumLike(albumId);
        return successResponse(h, {
            responseData: {
                likes: dataQuery.count,
            },
            responseCode: responeCode.OK,
            cache: dataQuery.cache,
        });
    };

    PostAlbumLikesById = async (r, h) => {
        const { id: userId } = r.auth.credentials;
        const { id: albumId } = r.params;

        await this.albumService.GetAlbumById(albumId);
        const alreadyLike = await this.albumService.CheckAlbumLike(userId, albumId);

        if (alreadyLike) {
            await this.albumService.DeleteAlbumLike(userId, albumId);
            return successResponse(h, {
                responseMessage: 'success dislike album',
                responseCode: responeCode.CREATED,
            });
        }
        await this.albumService.AddAlbumLike(userId, albumId);
        return successResponse(h, {
            responseMessage: 'success like album',
            responseCode: responeCode.CREATED,
        });
    };
}

module.exports = AlbumController;
