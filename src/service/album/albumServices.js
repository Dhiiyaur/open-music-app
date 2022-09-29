const { nanoid } = require('nanoid');
const fs = require('fs');
const NotFoundError = require('../../exceptions/notFoundError');
const { mapDBToModelAlbum } = require('../../utils/model/albumModel');

class AlbumService {
    constructor(db, folderPath, cacheService) {
        this._pool = db;
        this.folderPath = folderPath;
        this.cacheService = cacheService;

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
    }

    GetAlbums = async () => {
        const { rows } = await this._pool.query('SELECT id, name, year FROM albums');
        if (!rows.length) {
            throw new NotFoundError('failed to get all album');
        }
        return rows;
    };

    GetAlbumById = async (id) => {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };
        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to get detail album');
        }
        return rows.map(mapDBToModelAlbum)[0];
    };

    AddAlbum = async (payload) => {
        const generateID = `album-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
            values: [generateID, payload.name, payload.year],
        };
        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to add album');
        }
        return rows[0].id;
    };

    EditAlbum = async (id, payload) => {
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING name',
            values: [payload.name, payload.year, id],
        };
        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to edit album');
        }
        return rows[0].id;
    };

    DeleteAlbum = async (id) => {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING name',
            values: [id],
        };
        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to delete album');
        }
        return rows[0].id;
    };

    AddAlbumCover = async (filename, albumId) => {
        const coverUrlPath = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
        const query = {
            text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
            values: [coverUrlPath, albumId],
        };
        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to delete album');
        }
    };

    WriteAlbumImage = async (file) => {
        const newFilename = file.hapi.filename.replaceAll(' ', '_');
        const filename = `${+new Date()}-${newFilename}`;
        const path = `${this.folderPath}/${filename}`;
        const fileStream = fs.createWriteStream(path);

        const result = await new Promise((resolve, reject) => {
            fileStream.on('error', (error) => reject(error));
            file.pipe(fileStream);
            file.on('end', () => resolve(filename));
        });
        return result;
    };

    AddAlbumLike = async (userId, albumId) => {
        const generateID = `album-likes-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
            values: [generateID, userId, albumId],
        };
        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to like album');
        }
        await this.cacheService.Delete(`albumLikes-${albumId}`);
    };

    DeleteAlbumLike = async (userId, albumId) => {
        const query = {
            text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND "album_id" = $2 returning id',
            values: [userId, albumId],
        };
        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to dislike album');
        }
        await this.cacheService.Delete(`albumLikes-${albumId}`);
    };

    CheckAlbumLike = async (userId, albumId) => {
        const query = {
            text: 'SELECT * FROM user_album_likes WHERE user_id = $1 and album_id = $2',
            values: [userId, albumId],
        };
        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            return false;
        }
        return true;
    };

    GetAlbumLike = async (albumId) => {
        const getCache = await this.cacheService.Get(`albumLikes-${albumId}`);
        if (getCache) {
            return {
                cache: true,
                count: JSON.parse(getCache),
            };
        }
        const query = {
            text: 'select * from user_album_likes where album_id = $1',
            values: [albumId],
        };

        const { rowCount } = await this._pool.query(query);
        await this.cacheService.Set(`albumLikes-${albumId}`, JSON.stringify(rowCount));
        return {
            cache: false,
            count: rowCount,
        };
    };
}

module.exports = AlbumService;
