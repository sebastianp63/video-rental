const mongoose = require('mongoose');
const Joi = require('joi');


const possibleLanguages = ['PL','EN'];
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
        unique: true,
        trim: true,
    },
    genres: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Genre',
        required: true,
    }],
    relase_year: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        minlength: 50,
        maxlength: 1000,
        trim: true,
        required: true,
    },
    duration_time: {
        type: Number,
    },
    language: [{
        type: String,
        uppercase: true,
        enum: possibleLanguages,
        default: 'PL',
    }],
    sale_price: {
        reguired: true,
        type: Number,
    },
    imageURL: {
        required: true,
        type: String,
    }

})

movieSchema.virtual('url').get(function () {
    return '/api/admin/movie/' + this._id;
});

movieSchema.statics.possibleLanguages = function() {
    return possibleLanguages;
};

movieSchema.virtual("enum").get(function () {
    return possibleLanguages;
})

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(2).max(100).required(),
        genres: Joi.array().items(Joi.string()),
        relase_year: Joi.number().min(1920).max(new Date().getFullYear()).required(),
        imageURL: Joi.string().required(),
        description: Joi.string().min(10).max(1000).required(),
        duration_time: Joi.number().max(300).required(),
        language: Joi.array().items(Joi.string()),
        sale_price: Joi.number().required(),
    }
    return Joi.validate(movie, schema);
}
module.exports.Movie = mongoose.model('Movie', movieSchema);
module.exports.validate = validateMovie;