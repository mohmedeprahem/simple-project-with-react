// module requirement
const mongoose = require(`mongoose`);

const postSchema = new mongoose.Schema({
        title: {
            type: String,
            minLength: 5,
            required: true
        },

        content: {
            type: String,
            minLength: 5,
            required: true
        },
        creator: {
            type: {
                name: {
                    type: String,
                    required: true
                }
            },
            required: true
        },
        
    },
    { timestamps: true}
);

module.exports = mongoose.model('Post', postSchema);