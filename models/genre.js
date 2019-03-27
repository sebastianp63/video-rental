const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlenght: 5,
        maxlenght: 50,
        unique: true,
    }
})
genreSchema.virtual('url').get(function () {
    return '/api/admin/genre/' + this._id;
});

genreSchema.pre('save', function (next) {
    const name = this.name.toLowerCase();
    this.name = name.charAt(0).toUpperCase() + name.slice(1);
    next();
});

function validateGenre(genre) {
    const schema = { name: Joi.string().min(5).max(50).required() };
    return Joi.validate(genre, schema);
}

module.exports.validate = validateGenre;
module.exports.genreSchema = genreSchema;
module.exports.Genre = mongoose.model("Genre", genreSchema);
