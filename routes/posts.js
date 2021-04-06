// modules requirement
const express = require(`express`);
const router = express.Router();

// controllers files
const { addPost } = require(`../controllers/post`);

router.route(`/api/add-post`)
    .post(addPost)

module.exports = router