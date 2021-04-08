// modules requirement
const express = require(`express`);
const router = express.Router();

// middlewares files
const isAuth = require(`../middlewares/is-auth`)
const isAllowed = require(`../middlewares/is-authurized`)
// controllers files
const { 
    addPost,
    getPost,
    deletePost,
    getPosts,
    putPost
} = require(`../controllers/post`);

router.route(`/api/add-post`)
    .post(isAuth, addPost)

router.route(`/api/post/:postId`)
    .get(isAuth, getPost)

router.route(`/api/post/:postId`)
    .delete(isAuth, isAllowed, deletePost)

router.route(`/api/posts`)
    .get(isAuth, getPosts)

router.route(`/api/post/:postId`)
    .put(isAuth, isAllowed, putPost)
module.exports = router