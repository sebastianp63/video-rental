const mongoose = require("mongoose");
//const MONGODB_URI = 'mongodb://localhost:27017/VideoRenatl';
const MONGODB_URI = 'mongodb+srv://SEBA:nGJfiYDGlpq6nWde@project-vh6mh.mongodb.net/video_rental?retryWrites=true';

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
})
    .then(() => console.log('Connected to database...'))
    .catch(err => console.error("Connection filed..", err));

module.exports = { mongoose: mongoose, MONGODB_URI: MONGODB_URI };

