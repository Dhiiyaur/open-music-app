const CollaborationController = require('./collaborationController');

module.exports = {
    name: 'collaboration-plugin',
    version: '1.0.0',
    register: async (server, options) => {
        const collaborationController = new CollaborationController(server, options);
        server.route([
            {
                method: 'POST',
                path: '/collaborations',
                handler: collaborationController.PostAddCollaboration,
                options: {
                    auth: 'openmusic_jwt',
                },
            },
            {
                method: 'DELETE',
                path: '/collaborations',
                handler: collaborationController.DeleteCollaboration,
                options: {
                    auth: 'openmusic_jwt',
                },
            },
        ]);
    },
};
