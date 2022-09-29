require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const path = require('path');
const Inert = require('@hapi/inert');
const pool = require('./repository/db/repository');
const config = require('./utils/config');

const redisClient = require('./repository/redis/redis');
const CacheService = require('./service/cache/cacheService');

const AlbumPlugin = require('./controller/album');
const AlbumService = require('./service/album/albumServices');
const AlbumValidator = require('./middleware/validator/albumValidator');

const SongPlugin = require('./controller/song');
const SongService = require('./service/song/songServices');
const SongValidator = require('./middleware/validator/songValidator');

const UserPlugin = require('./controller/user');
const UserService = require('./service/user/userServices');
const UserValidator = require('./middleware/validator/userValidator');

const AuthenticationPlugin = require('./controller/authentication');
const AuthenticationValidator = require('./middleware/validator/authenticationValidator');
const AuthenticationService = require('./service/authentication/authenticationService');

const PlaylistPlugin = require('./controller/playlist');
const PlaylistValidator = require('./middleware/validator/playlistValidator');
const PlaylistService = require('./service/playlist/playlistService');

const CollaborationPlugin = require('./controller/collaboration');
const CollaborationValidator = require('./middleware/validator/collaborationValidator');
const CollaborationService = require('./service/collaboration/collaborationService');

const ExportPlugin = require('./controller/export');
const ExportValidator = require('./middleware/validator/exportValidator');
const ExportService = require('./service/export/exportService');

const TokenManager = require('./utils/tokenManager');
const { failResponse } = require('./utils/responses');

const init = async () => {
    const cacheService = new CacheService(redisClient);
    const albumServices = new AlbumService(pool, path.resolve(__dirname, 'repository/storage/albumImage'), cacheService);
    const songServices = new SongService(pool);
    const userServices = new UserService(pool);
    const authenticationServices = new AuthenticationService(pool);
    const playlistServices = new PlaylistService(pool);
    const collaborationServices = new CollaborationService(pool);

    const server = Hapi.server({
        port: config.app.port,
        host: config.app.host,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: Inert,
        },
    ]);

    server.auth.strategy('openmusic_jwt', 'jwt', {
        keys: config.security.access_token_key,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: config.security.access_token_age,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });

    await server.register([
        {
            plugin: AlbumPlugin,
            options: {
                validator: AlbumValidator,
                service: {
                    albumService: albumServices,
                    songService: songServices,
                    folderPath: path.resolve(__dirname, 'repository/storage/albumImage'),
                },
            },
        },
        {
            plugin: SongPlugin,
            options: {
                validator: SongValidator,
                service: songServices,
            },
        },
        {
            plugin: UserPlugin,
            options: {
                validator: UserValidator,
                service: userServices,
            },
        },
        {
            plugin: AuthenticationPlugin,
            options: {
                validator: AuthenticationValidator,
                service: {
                    userService: userServices,
                    authenticationService: authenticationServices,
                },
                token: TokenManager,
            },
        },
        {
            plugin: PlaylistPlugin,
            options: {
                validator: PlaylistValidator,
                service: {
                    playlistService: playlistServices,
                    songService: songServices,
                    collaborationService: collaborationServices,
                },
            },
        },
        {
            plugin: CollaborationPlugin,
            options: {
                validator: CollaborationValidator,
                service: {
                    collaborationService: collaborationServices,
                    userService: userServices,
                    playlistService: playlistServices,
                },
            },
        },
        {
            plugin: ExportPlugin,
            options: {
                validator: ExportValidator,
                service: {
                    playlistService: playlistServices,
                    songService: songServices,
                    exportService: ExportService,
                },
            },
        },
    ]);

    server.ext('onPreResponse', failResponse);
    await server.start();
};

init();
