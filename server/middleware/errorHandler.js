const { ServerError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
    if (err instanceof ServerError) {
        return res.status(err.getCode()).json({
            status: 'error',
            message: err.message
        });
    }
    return res.status(500).json({
        status: 'error',
        message: err.message
    });
}


module.exports = errorHandler;