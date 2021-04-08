// module requirement
const express = require('express');
const routes = express.Router();

const { 
    signUp,
    login
} = require(`../controllers/auth`);

routes.route('/api/signup')
    .put(signUp)

routes.route('/api/login')
    .post(login)

module.exports = routes