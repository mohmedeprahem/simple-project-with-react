// utils files requirement
const Handler = require(`../utils/error`);

const errorHandler = (err, req, res, next) => {
    let error = {...err};
    console.log(err)

    if (err.code === 11000) {
        error = new Handler(422, err.message)
    }

    if (err.name === 'ValidationError') {
        error = new Handler(400, err.message)
    }

    res.status(error.statusCode || 500).json({
        access: false,
        message: error.message || `server error`
    })
}

module.exports = errorHandler