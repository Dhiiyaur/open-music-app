const responeCode = require('../responeCode');
const ClientError = require('../../exceptions/clientError');

const successResponse = (h, {
    responseMessage, responseData, responseCode = responeCode.OK, cache = false,
}) => {
    const response = {
        status: 'success',
    };

    if (responseMessage) {
        response.message = responseMessage;
    } if (responseData) {
        response.data = responseData;
    }

    if (cache) {
        return h.response(response).header('X-Data-Source', 'cache').code(responseCode);
    }
    return h.response(response).code(responseCode);
};

const failResponse = (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
        if (response instanceof ClientError) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }
        if (!response.isServer) {
            return h.continue;
        }
        const newResponse = h.response({
            status: 'error',
            message: 'Internal Server Error',
        });
        newResponse.code(responeCode.INTERNAL_SERVER_ERROR);
        return newResponse;
    }
    return h.continue;
};

module.exports = { successResponse, failResponse };
