// mongodb schemas
const postSchema = require(`../models/post`);

// utils files requirement
const Handler = require(`../utils/error`);

const isAllowed = async (req, res, next) => {
    try {
        // find post
        const result = await postSchema.findById(req.params.postId);

        if (!result) return next(new Handler(404, `no post with id ${req.params.postId}`));

        // check if user is authurized to edit post
        console.log(req.user.id == result.creator.id)
        if (!(req.user.id == result.creator.id)) return next(new Handler(403, `forbaddin`));
        console.log(1)
        next();
    } catch (err) {
        next(err)
    }
}

module.exports = isAllowed;