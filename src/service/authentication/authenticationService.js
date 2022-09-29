const InvariantError = require('../../exceptions/invariantError');

class AuthenticationService {
    constructor(db) {
        this._pool = db;
    }

    AddRefreshToken = async (token) => {
        const query = {
            text: 'INSERT INTO authentications VALUES($1)',
            values: [token],
        };

        await this._pool.query(query);
    };

    VerifyRefreshToken = async (refreshToken) => {
        const query = {
            text: 'SELECT token FROM authentications WHERE token = $1',
            values: [refreshToken],
        };

        const result = await this._pool.query(query);
        if (result.rowCount === 0) {
            throw new InvariantError('invalid refresh token');
        }
    };

    DeleteRefreshToken = async (refreshToken) => {
        const query = {
            text: 'DELETE FROM authentications WHERE token = $1',
            values: [refreshToken],
        };

        await this._pool.query(query);
    };
}

module.exports = AuthenticationService;
