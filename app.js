// modules requirement
const express = require('express');
const app = express();

// connect to port
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`connect to port ${port}...`)
});