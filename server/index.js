const express = require('express');
const path = require('path');
// Routes
const registeredGeneralPublicAuthRoutes = require('./routes/api/registeredgeneralpublic/auth');

const PORT = process.env.PORT || 5000;
const app = express();
const db = require("./db");
const errorHandler = require('./middleware/errorHandler');
const {GeneralError} = require('./utils/errors');

db.connect();

// parse json body content
app.use(express.json());

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '..', 'client', 'covid19-app', 'build')));

// Answer API requests.
app.use('/api/registeredgeneralpublic/auth', registeredGeneralPublicAuthRoutes);

app.get('/test', (request, response) => {
    throw new GeneralError("Test");
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, '..', 'client', 'covid19-app', 'build', 'index.html'));
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));

module.exports = app;
