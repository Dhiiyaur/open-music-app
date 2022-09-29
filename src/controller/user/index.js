const UserController = require('./userController');

module.exports = {
    name: 'user-plugin',
    version: '1.0.0',
    register: async (server, options) => {
        const userController = new UserController(server, options);
        server.route([
            {
                method: 'POST',
                path: '/users',
                handler: userController.PostAddUser,
            },
        ]);
    },
};
