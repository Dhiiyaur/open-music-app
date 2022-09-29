const PlaylistController = require('./playlistController');

module.exports = {
    name: 'playlist-plugin',
    version: '1.0.0',
    register: async (server, options) => {
        const playlistController = new PlaylistController(server, options);
        server.route([
            {
                method: 'GET',
                path: '/playlists',
                handler: playlistController.GetAllPlaylist,
                options: {
                    auth: 'openmusic_jwt',
                },
            },
            {
                method: 'POST',
                path: '/playlists',
                handler: playlistController.PostPlaylist,
                options: {
                    auth: 'openmusic_jwt',
                },
            },
            {
                method: 'DELETE',
                path: '/playlists/{id}',
                handler: playlistController.DeletePlaylist,
                options: {
                    auth: 'openmusic_jwt',
                },
            },
            {
                method: 'POST',
                path: '/playlists/{id}/songs',
                handler: playlistController.PostSongToPlaylist,
                options: {
                    auth: 'openmusic_jwt',
                },
            },
            {
                method: 'GET',
                path: '/playlists/{id}/songs',
                handler: playlistController.GetPlaylistById,
                options: {
                    auth: 'openmusic_jwt',
                },
            },
            {
                method: 'DELETE',
                path: '/playlists/{id}/songs',
                handler: playlistController.DeleteSongFromPlaylist,
                options: {
                    auth: 'openmusic_jwt',
                },
            },
            {
                method: 'GET',
                path: '/playlists/{id}/activities',
                handler: playlistController.GetActivitiesById,
                options: {
                    auth: 'openmusic_jwt',
                },
            },

        ]);
    },
};
