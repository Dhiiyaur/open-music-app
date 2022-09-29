const AlbumController = require('./albumController');

module.exports = {
    name: 'album-plugin',
    version: '1.0.0',
    register: async (server, options) => {
        const albumController = new AlbumController(server, options);
        server.route([
            {
                method: 'GET',
                path: '/albums',
                handler: albumController.GetAllAlbums,
            },
            {
                method: 'GET',
                path: '/albums/{id}',
                handler: albumController.GetDetailAlbumById,
            },
            {
                method: 'POST',
                path: '/albums',
                handler: albumController.PostAlbum,
            },
            {
                method: 'PUT',
                path: '/albums/{id}',
                handler: albumController.EditAlbumById,
            },
            {
                method: 'DELETE',
                path: '/albums/{id}',
                handler: albumController.DeleteAlbum,
            },
            {
                method: 'POST',
                path: '/albums/{id}/covers',
                handler: albumController.PostAlbumCover,
                options: {
                    payload: {
                        allow: 'multipart/form-data',
                        multipart: true,
                        parse: true,
                        output: 'stream',
                        maxBytes: 512000,
                    },
                },
            },
            {
                method: 'GET',
                path: '/upload/images/{imageId}',
                handler: albumController.GetAlbumCover,
            },

            {
                method: 'POST',
                path: '/albums/{id}/likes',
                handler: albumController.PostAlbumLikesById,
                options: {
                    auth: 'openmusic_jwt',
                },
            },
            {
                method: 'GET',
                path: '/albums/{id}/likes',
                handler: albumController.GetAlbumLikesById,
            },
        ]);
    },
};
