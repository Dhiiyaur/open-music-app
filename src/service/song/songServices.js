const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/notFoundError');

class SongService {
    constructor(db) {
        this._pool = db;
    }

    GetSongs = async (title = '', performer = '') => {
        const query = {
            text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 and performer ILIKE $2',
            values: [`%${title}%`, `%${performer}%`],
        };
        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to get all song');
        }
        return rows;
    };

    GetSongById = async (id) => {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };
        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to get detail song');
        }
        return rows[0];
    };

    GetSongByAlbumId = async (id) => {
        const query = {
            text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
            values: [id],
        };
        const { rows } = await this._pool.query(query);
        return rows;
    };

    AddSong = async (payload) => {
        const generateID = `song-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [generateID, payload.title, payload.year, payload.genre, payload.performer, payload.duration, payload.albumId],
        };
        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to add album');
        }
        return rows[0].id;
    };

    EditSong = async (id, payload) => {
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "album_id" = $6 WHERE id = $7 RETURNING title',
            values: [payload.title, payload.year, payload.genre, payload.performer, payload.duration, payload.albumId, id],
        };
        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to edit album');
        }
        return rows[0].title;
    };

    DeleteSong = async (id) => {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING title',
            values: [id],
        };
        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to delete song');
        }
        return rows[0].title;
    };

    GetSongsByPlaylistId = async (id) => {
        const query = {
            text: `
            SELECT songs.id, songs.title, songs.performer
            FROM songs
            LEFT JOIN playlist_songs on songs.id = playlist_songs.song_id
            WHERE playlist_songs.playlist_id = $1`,
            values: [id],
        };
        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to get all playlist');
        }
        return rows;
    };
}

module.exports = SongService;
