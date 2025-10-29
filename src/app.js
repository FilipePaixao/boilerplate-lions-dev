const express = require('express');
const userRoutes = require('./routes/user.routes');
const error = require('./middlewares/error.middleware');

const app = express();
app.use(express.json());

app.use('/api', userRoutes);

app.use(error);

module.exports = app;
