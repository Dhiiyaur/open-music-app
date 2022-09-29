const SongController = require('./songController');

module.exports = {
    name: 'song-plugin',
    version: '1.0.0',
    register: async (server, options) => {
        const songController = new SongController(server, options);
        server.route([
            {
                method: 'GET',
                path: '/songs',
                handler: songController.GetAllSong,
            },
            {
                method: 'GET',
                path: '/songs/{id}',
                handler: songController.GetDetailSongById,
            },
            {
                method: 'POST',
                path: '/songs',
                handler: songController.PostSong,
            },
            {
                method: 'PUT',
                path: '/songs/{id}',
                handler: songController.EditSongById,
            },
            {
                method: 'DELETE',
                path: '/songs/{id}',
                handler: songController.DeleteSongById,
            },
        ]);
    },
};
