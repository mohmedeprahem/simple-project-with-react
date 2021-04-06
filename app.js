// modules requirement
const express = require('express');
const app = express();
const dotenv = require('dotenv')

// using dotenv
dotenv.config({path: `./config/config.env`});

// connect to mongodb
const connect = require(`./config/db`);
connect();

// read req.body
app.use(express.json())
app.use(express.urlencoded({ extended: false }));


// CORS security
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Athurization');
    next()
});

// routes files
const postsRoutes = require(`./routes/posts`);
app.use(postsRoutes);

// error handler
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler)

// connect to port
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`connect to port ${port}...`)
});