// module requirement
const path = require(`path`);
const fs = require('fs');

// mongodb schemas
const postSchema = require(`../models/post`);
const userSchema = require(`../models/user`);

// utils files requirement
const Handler = require(`../utils/error`);

// @disc:   add new posts
// @route:  POST /api/add-post
// @access: private
exports.addPost = async (req, res, next) => {
    try {
        let result;

        // check if user upload image
        if (!req.files) {
            console.log(2)
            return next(new Handler(400, `upload file`))
        }
        console.log(req.files)
        let file = req.files.image;

        // make sure file is photo
        if (!file.mimetype.startsWith('image')) {
            return next(new Handler(400, `upload image`))
        }

        // check file size
        if (file.size > process.env.MAX_FILE_SIZE) {
            return next(new Handler(400, `upload an image less than ${process.env.MAX_FILE_SIZE}`))
        }

        // create custom file
        file.name = `photo_${Date.now()}${path.parse(file.name).ext}`;
        
        file.mv(`${process.env.FILE_UPLOAD_PATH}${file.name}`, async err => {

            if (err) {
                return next(500, `problem with file upload`)
            }

            // save new post in db
            req.body.imageUrl = file.name;
            result = await postSchema.create({
                title: req.body.title,
                content: req.body.content,
                imageUrl: req.body.imageUrl,
                creator: {
                    id: req.user.id,
                    name: req.user.name
                },
            })

            let user = await userSchema.findById(req.user.id);
            
            if (!user) return next(new Handler(401, `unauth`));

            user.posts.push(result._id);
            await user.save();

            // send response
            res.status(201).json({
                message: 'post created successfully',
                post: result,
            })
        });

    } catch (err) {
        console.log(err)
        next(err)
    }
}

// @disc:   get post
// @route:  GET /api/post/:postId
// @access: private
exports.getPost = async (req, res, next) => {
    try {
        // find post
        const result = await postSchema.findById(req.params.postId);
        
        if (!result) {
            return next(new Handler(404, `post is not found`));
        }

        // send post to cliant
        res.status(200).json({
            message: `found post`,
            post: result
        });
    } catch (err) {
        console.log(err)
        next(err)
    }
}

// @disc:   delete post
// @route:  DELETE /api/post/:postId
// @access: private
exports.deletePost = async (req, res, next) => {
    try {
        // find post and delete him
        const post = await postSchema.findByIdAndDelete(req.params.postId);

        if (!post) {
            return next(new Handler(500, 'faild to delete post'))
        }
        
        // delete image of post
        const pathImg = `./public/img/${post.imageUrl}`;
        fs.unlink(pathImg, (err) => {
            if (err) {
                return next(500, `faild to delete post`)
            }
            console.log('path/file.txt was deleted');
        });

        await userSchema.findByIdAndUpdate( req.user.id, { $pull:{ posts: post._id }})
        // send successfully response
        res.status(200).json({
            message: `successfully deleted post`

        })
    } catch (err) {
        console.log(err)
        next(err)
    }
}

// @disc:   get all posts
// @route:  GEt /api/posts
// @access: private
exports.getPosts = async (req, res, next) => {
    try {
        // add pagenation
        const { page = 1 } = req.query;
        const limit = 10

        // find posts
        const result = await postSchema
            .find()
            .limit(limit)
            .skip((page - 1) * limit);

        // send posts to cliant
        res.status(200).json({
            message: `get all posts`,
            posts: result
        })
    } catch (err) {
        next(err)
    }
}

// @disc:   update post
// @route:  PUT /api/post/:postId
// @access: private
exports.putPost = async (req, res, next) => {
    try {
        console.log(req.body)
        console.log(req.files)
        // find post
        let result = await postSchema.findById(req.params.postId)

        if (!result) return next(new Handler(404, `no post with id ${req.params.postId}`));

        // check if there image
        let imageUrl = req.body.image
        if (req.files) {
            const file = req.files.image

            // check if file is image and less than max size
            if (!file.mimetype.startsWith('image') || file.size > process.env.MAX_FILE_SIZE) {
                return next(new Handler(400, `please upload image less than ${process.env.MAX_FILE_SIZE} MB`));
            };

            // delete old image

            const pathImg = `./public/img/${result.imageUrl}`;
            fs.unlink(pathImg, (err) => {
                if (err) {
                    return next(500, `faild to delete post`)
                }
                console.log('path/file.txt was deleted');
            });

            // add new path of image
            imageUrl = `photo_${Date.now()}${path.parse(file.name).ext}`;
            console.log(imageUrl)
            // upload new image
            file.mv(`${process.env.FILE_UPLOAD_PATH}${imageUrl}`, async err => {
                if (err) return next(500, `faild to save update`);

                // save update
                result.title = req.body.title;
                result.content = req.body.content;
                result.imageUrl = imageUrl;
                await result.save();
            })

            // send successfully response
            return res.status(200).json({
                message: `post updated`,
                post: result
            })
        }

        // check if data has image path or not
        if (!imageUrl) return next(new Handler(400, `bad request`));

        //add new update
        result.title = req.body.title;
        result.content = req.body.content;
        await result.save();

        // send successfully response
        return res.status(200).json({
            message: `post updated`,
            post: result
        })
    } catch (err) {
        next(err)
    }
}