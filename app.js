// modules requirement
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const fileupload = require(`express-fileupload`);
const path = require(`path`)

// using dotenv
dotenv.config({path: `./config/config.env`});

// check env of app
if (process.env.NODE_ENV === 'production') {

   app.use(express.static(`client/build`));
}

// connect to mongodb
const connect = require(`./config/db`);
connect();

// send image to front
app.use(`/public`, express.static(path.join(__dirname, 'public')))

// read req.body
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

// using exprss-fileupload
app.use(fileupload());

// CORS security
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// routes files
const userRoutes = require(`./routes/auth`);
app.use(userRoutes);
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