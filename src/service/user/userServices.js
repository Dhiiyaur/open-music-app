const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const NotFoundError = require('../../exceptions/notFoundError');
const InvariantError = require('../../exceptions/invariantError');
const AuthenticationError = require('../../exceptions/authenticationError');

class UserService {
    constructor(db) {
        this._pool = db;
    }

    AddUser = async (payload) => {
        const generateID = `user-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(payload.password, 10);

        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
            values: [generateID, payload.username, payload.fullname, hashedPassword],
        };
        const { rows } = await this._pool.query(query);
        if (!rows.length) {
            throw new NotFoundError('failed to add user');
        }
        return rows[0].id;
    };

    CheckUsername = async (payload) => {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [payload.username],
        };

        const { rowCount } = await this._pool.query(query);
        if (rowCount > 0) {
            throw new InvariantError('Fail to add user, username already used');
        }
    };

    CheckUserId = async (userId) => {
        const query = {
            text: 'SELECT id FROM users WHERE id = $1',
            values: [userId],
        };

        const { rowCount } = await this._pool.query(query);
        if (rowCount === 0) {
            throw new NotFoundError('Fail to add collaboration, user not found');
        }
    };

    VerifyUserPassword = async (payload) => {
        const query = {
            text: 'SELECT id, password FROM users WHERE username = $1',
            values: [payload.username],
        };

        const result = await this._pool.query(query);
        if (result.rowCount === 0) {
            throw new AuthenticationError('Wrong credentials');
        }

        const { id, password: hashedPassword } = result.rows[0];
        const match = await bcrypt.compare(payload.password, hashedPassword);

        if (!match) {
            throw new AuthenticationError('Wrong credentials');
        }

        return id;
    };
}

module.exports = UserService;
