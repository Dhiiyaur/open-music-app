const AuthenticationController = require('./authenticationController');

module.exports = {
    name: 'authetification-plugin',
    version: '1.0.0',
    register: async (server, options) => {
        const authenticationController = new AuthenticationController(server, options);
        server.route([
            {
                method: 'POST',
                path: '/authentications',
                handler: authenticationController.LoginUser,
            },
            {
                method: 'PUT',
                path: '/authentications',
                handler: authenticationController.RefreshUserToken,
            },
            {
                method: 'DELETE',
                path: '/authentications',
                handler: authenticationController.DeleteUserToken,
            },
        ]);
    },
};
