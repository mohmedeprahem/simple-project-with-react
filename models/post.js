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
        imageUrl: {
            type: String,
            required: true
        },
        creator: {
            type: {
                name: {
                    type: String,
                    required: true
                },
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                }
            },
            required: true
        },
        
    },
    { timestamps: true}
);

module.exports = mongoose.model('Post', postSchema);