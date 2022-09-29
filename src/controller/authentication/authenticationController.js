const autoBind = require('auto-bind');
const responeCode = require('../../utils/responeCode');
const { successResponse } = require('../../utils/responses');

class AuthenticationController {
    constructor(server, options) {
        this.server = server;
        this.userService = options.service.userService;
        this.authenticationService = options.service.authenticationService;
        this.validator = options.validator;
        this.tokenManager = options.token;
        autoBind(this);
    }

    LoginUser = async (r, h) => {
        this.validator.LoginUserPayload(r.payload);
        const id = await this.userService.VerifyUserPassword(r.payload);

        const accessToken = this.tokenManager.generateAccessToken({ id });
        const refreshToken = this.tokenManager.generateRefreshToken({ id });
        await this.authenticationService.AddRefreshToken(refreshToken);

        return successResponse(h, {
            responseData: {
                accessToken,
                refreshToken,
            },
            responseCode: responeCode.CREATED,
        });
    };

    RefreshUserToken = async (r, h) => {
        this.validator.RefreshTokenPayload(r.payload);
        const { refreshToken } = r.payload;

        await this.authenticationService.VerifyRefreshToken(refreshToken);
        const tokenData = this.tokenManager.verifyRefreshToken(refreshToken);
        const accessToken = this.tokenManager.generateAccessToken(tokenData.id);

        return successResponse(h, {
            responseData: {
                accessToken,
            },
            responseCode: responeCode.OK,
        });
    };

    DeleteUserToken = async (r, h) => {
        this.validator.DeleteTokenPayload(r.payload);

        const { refreshToken } = r.payload;
        await this.authenticationService.VerifyRefreshToken(refreshToken);
        await this.authenticationService.DeleteRefreshToken(refreshToken);

        return successResponse(h, {
            responseMessage: 'successfully delete token',
            responseCode: responeCode.OK,
        });
    };
}

module.exports = AuthenticationController;
