const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/notFoundError');
const InvariantError = require('../../exceptions/invariantError');

class CollaboratorService {
    constructor(db) {
        this._pool = db;
    }

    AddCollaboration = async (playlistId, userId) => {
        const generateID = `collaboration-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
            values: [generateID, playlistId, userId],
        };

        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to add collaborations');
        }
        return rows[0].id;
    };

    DeleteCollaboration = async (playlistId, userId) => {
        const query = {
            text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
            values: [playlistId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('failed to delete collaboration');
        }
    };
}

module.exports = CollaboratorService;
