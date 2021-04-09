const express = require('express');
const path = require('path');
const config = require('config');
const mongoose = require('mongoose');

// Routes
const loginRoutes = require('./routes/api/login');

const isDev = process.env.NODE_ENV !== 'production';

const PORT = process.env.PORT || 5000;
const app = express();
// access config variables using config.get('db.name');
mongoose.connect(`mongodb+srv://${process.env.CSCI334_MONGODB_USER}:${process.env.CSCI334_MONGODB_PASS}@${config.get('db.host')}/${config.get('db.name')}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology:  true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '..', 'client', 'covid19-app', 'build')));

// Answer API requests.
app.use('/api/login', loginRoutes);

// All remaining requests return the React app, so it can handle routing.
app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, '..', 'client', 'covid19-app', 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
});

module.exports = app;
