// mongodb schemas
const postSchema = require(`../models/post`);

// @disc:   add new posts
// @route:  POST /api/add-post
// @access: public
exports.addPost = async (req, res, next) => {
    try {
        // create new post in db
        const result = await postSchema.create(req.body);

        

        // send response
        res.status(201).json({
            message: 'post created successfully',
            post: result
        })
    } catch (err) {
        next(err)
    }
}