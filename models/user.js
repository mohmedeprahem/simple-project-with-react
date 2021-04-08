// module requirement
const mongoose = require(`mongoose`);

// create user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    posts: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }]
    }
});

module.exports = mongoose.model('User', userSchema);