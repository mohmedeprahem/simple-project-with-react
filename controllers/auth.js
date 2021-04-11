// module requirement
const bcrypt = require('bcryptjs');
const jwt = require(`jsonwebtoken`);

// mongodb schemas
const userSchema = require(`../models/user`);

// utils files requirement
const Handler = require(`../utils/error`);

// @disc:   add new user
// @route:  POST '/api/sign-up'
// @access: public
exports.signUp = async (req, res, next) => {
    try {
        console.log(req.body)
        // validation password
        if (req.body.password.length < 8) {
            return next(400, `invalid password`)
        }

        // hash password
        const ecryptPassword = bcrypt.hashSync(req.body.password, 12)
        
        // save new user in database
        await userSchema.create({
            name: req.body.name,
            email: req.body.email,
            status: `iam now`,
            password: ecryptPassword
        })

        // create JWT token


        // send successfully response
        res.status(201).json({
            message: `created new user`
        })

    } catch (err) {
        next(err)
    }
}

// @disc:   login
// @route:  POST '/api/login'
// @access: public
exports.login = async (req, res, next) => {
    try {
    // check email
    const result = await userSchema.findOne({email: req.body.email});

    if (!result) return next(new Handler(422, `invaled data1`));
        console.log(2)
    // check password
    const checkPassword = await bcrypt.compare(req.body.password, result.password);
    
    if (!checkPassword) return next(new Handler(422, `invaled data2`));
    // create jwt
    const token = jwt.sign(
        { 
            id: result._id,
            name: result.name
        }, 
        process.env.JWT_SECRET, {
            expiresIn: '1h'
        }
    )

    // send response
    res.status(200).json({
        token: token,
        message: `login successfully`
    })
    } catch (err) {
        next(err)
    }
}