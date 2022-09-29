const ExportController = require('./exportContoller');

module.exports = {
    name: 'export-plugin',
    version: '1.0.0',
    register: async (server, options) => {
        const exportController = new ExportController(server, options);
        server.route([
            {
                method: 'POST',
                path: '/export/playlists/{playlistId}',
                handler: exportController.PostExportPlaylistById,
                options: {
                    auth: 'openmusic_jwt',
                },
            },
        ]);
    },
};
