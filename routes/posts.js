// modules requirement
const express = require(`express`);
const router = express.Router();

// controllers files
const { 
    addPost,
    getPost,
    deletePost,
    getPosts
} = require(`../controllers/post`);

router.route(`/api/add-post`)
    .post(addPost)

router.route(`/api/post/:postId`)
    .get(getPost)

router.route(`/api/post/:postId`)
    .delete(deletePost)

router.route(`/api/posts`)
    .get(getPosts)
module.exports = router