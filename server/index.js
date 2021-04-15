const express = require('express');
const path = require('path');
// Routes
const registeredGeneralPublicAuthRoutes = require('./routes/api/registeredgeneralpublic/auth');
const registeredBusinessOwnerAuthRoutes = require('./routes/api/businessowner/auth');
const registeredHealthProfessionalAuthRoutes = require('./routes/api/healthprofessional/auth');
const generalPublicRoutes = require('./routes/api/generalpublic/routes');

const PORT = process.env.PORT || 5000;
const app = express();
const db = require("./db");
const errorHandler = require('./middleware/errorHandler');

db.connect();

// parse json body content
app.use(express.json());

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '..', 'client', 'covid19-app', 'build')));

// Answer API requests.
app.use('/api/registeredgeneralpublic/auth', registeredGeneralPublicAuthRoutes);
app.use('/api/businessowner/auth', registeredBusinessOwnerAuthRoutes);
app.use('/api/healthprofessional/auth', registeredHealthProfessionalAuthRoutes);
app.use('/api/generalpublic', generalPublicRoutes);

// All remaining requests return the React app, so it can handle routing.
app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, '..', 'client', 'covid19-app', 'build', 'index.html'));
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));

module.exports = app;
