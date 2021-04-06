// utils files requirement
const Handler = require(`../utils/error`);

const errorHandler = (err, req, res, next) => {
    let error;

    if (err.name === 'ValidationError') {
        error = new Handler(400, err.message)
    }

    res.status(error.statusCode || 500).json({
        access: false,
        message: error.message || `server error`
    })
}

module.exports = errorHandler