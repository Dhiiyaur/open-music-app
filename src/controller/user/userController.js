const autoBind = require('auto-bind');
const responeCode = require('../../utils/responeCode');
const { successResponse } = require('../../utils/responses');

class UserController {
    constructor(server, options) {
        this.server = server;
        this.userService = options.service;
        this.validator = options.validator;
        autoBind(this);
    }

    PostAddUser = async (r, h) => {
        this.validator.AddUserPayload(r.payload);
        await this.userService.CheckUsername(r.payload);
        const user_id = await this.userService.AddUser(r.payload);

        return successResponse(h, {
            responseData: {
                userId: user_id,
            },
            responseCode: responeCode.CREATED,
        });
    };
}

module.exports = UserController;
