// module requirement
const jwt = require(`jsonwebtoken`)

// utils files requirement
const Handler = require(`../utils/error`);

// mongodb schemas
const userSchema = require(`../models/user`);

const isAuth = (req, res, next) => {
    const bearerToken = req.get('Authorization');
    console.log(bearerToken)
    // chack if there token
    if (!bearerToken) return next(new Handler(401, `unauthorized`));

    // chack if the token is valid
    const token = bearerToken.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return next(new Handler(403, `forbidden`));

        const result = await userSchema.findById(user.id);
        if (!result) return next(new Handler(403, `forbidden`));
        req.user = result;
        next();
    })
}

module.exports = isAuth;