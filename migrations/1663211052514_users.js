/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('users', {
        id: {
            type: 'VARCHAR(60)',
            primaryKey: true,
        },
        username: {
            type: 'TEXT',
            notNull: true,
        },
        fullname: {
            type: 'text',
            notNull: true,
        },
        password: {
            type: 'text',
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('users');
};
