const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/notFoundError');
const AuthorizationError = require('../../exceptions/authorizerError');

class PlaylistService {
    constructor(db) {
        this._pool = db;
    }

    GetPlaylist = async (ownerId) => {
        const query = {
            text: `
                select playlists.id, playlists.name, users.username 
                FROM playlists
                LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
                INNER JOIN users ON playlists.owner = users.id
                WHERE playlists.owner = $1 OR collaborations.user_id = $1
                `,
            values: [ownerId],
        };

        const { rows } = await this._pool.query(query);
        return rows;
    };

    AddPlaylist = async (payload, userId) => {
        const generateID = `playlist-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [generateID, payload.name, userId],
        };

        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to add album');
        }
        return rows[0].id;
    };

    DeletePlaylist = async (playlistId) => {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1',
            values: [playlistId],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('failed to delete playlist, playlist not found');
        }
    };

    VerifyPlaylistOwner = async (userId, playlistId) => {
        const query = {
            text: `
            SELECT *
            FROM playlists
            WHERE id = $1
            `,
            values: [playlistId],
        };
        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('playlist not found');
        }
        if (rows[0].owner !== userId) {
            throw new AuthorizationError('You do not have access to this playlist');
        }
    };

    VerifyPlaylistAccess = async (userId, playlistId) => {
        const query = {
            text: `
            select *
            from playlists p 
            inner join users u on u.id = p."owner" 
            left join collaborations c on c.playlist_id = p.id  
            where (p."owner" = $1 or c.user_id = $1) and p.id = $2
            `,
            values: [userId, playlistId],
        };
        const result = await this._pool.query(query);
        if (result.rowCount === 0) {
            throw new AuthorizationError('You do not have access to this playlist');
        }
    };

    AddSongToPlaylist = async (songId, playlistId) => {
        const generateID = `playlist-song-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3)',
            values: [generateID, playlistId, songId],
        };

        await this._pool.query(query);
    };

    GetPlaylistById = async (id) => {
        const query = {
            text: `
            SELECT playlists.id, playlists.name, users.username
            FROM playlists 
            LEFT JOIN users on playlists.owner = users.id 
            WHERE playlists.id = $1`,
            values: [id],
        };

        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to get detail playlist');
        }
        return rows[0];
    };

    DeleteSongFromPlaylistBySongId = async (songId) => {
        const query = {
            text: 'DELETE FROM playlist_songs WHERE song_id = $1',
            values: [songId],
        };

        await this._pool.query(query);
    };

    AddPlaylistActivities = async (type, { playlistId, songId, userId }) => {
        const generateID = `playlist-song-activities-${nanoid(16)}`;
        const timeNow = new Date().toISOString();

        const query = {
            text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6)',
            values: [generateID, playlistId, songId, userId, type, timeNow],
        };

        await this._pool.query(query);
    };

    GetPlaylistActivities = async (playlistId) => {
        const query = {
            text: `
                select u.username, s.title ,psa."action" , psa."time" 
                from playlist_song_activities psa 
                inner join songs s on s.id = psa.song_id 
                inner join users u ON u.id = psa.user_id 
                where psa.playlist_id = $1
            `,
            values: [playlistId],
        };

        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to get playlist activities');
        }
        return rows;
    };
}

module.exports = PlaylistService;
