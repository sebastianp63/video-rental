const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const {Rental } = require('../models/rental')

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


exports.movieCreateGet =   function(req,res){
    const languages = arrayToObjectArray( Movie.possibleLanguages(), "language");;
    Genre.find({},(err, genres) => {
        if (err) { 
            return next(err); 
        }
        res.render('admin/movie_form', { title: 'Create Movie', genres:genres, languages: languages  });
})}

exports.movieCreatePost = [
    (req, res, next) => {
        req.body.genres =  toArray(req.body.genres);
        let languages =  toArray(req.body.language);
        if(languages.length === 0 ){
            languages.push('PL');
        }
        req.body.language = languages;    
        next();
    },

    (req,res, next) => {
            const { error } = validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            next();
        
    },

    (req, res, next) => {
        let movie = new Movie({
            title: req.body.title,
            genres: req.body.genres,
            relase_year: req.body.relase_year,
            imageURL: req.body.imageURL,
            description: req.body.description,
            duration_time: req.body.duration_time,
            language: req.body.language,
            sale_price: req.body.sale_price,
        });

        Movie.findOne({ 'title': req.body.title })
        .exec( function (err, foundMovie) {
            if (err) return next(err);
                
            if (foundMovie) {
                res.status(400).send("This movie have already exist");
            }
            else {
                movie.save( (err, movie) => { 
                    if (err) { return next(err); };
                    res.redirect(movie.url+"/details");
                })
            }
        });
   
    }

];


exports.movieGetAll = async function(req,res){
    const movies = await Movie.find()
    .sort('name');
    res.render("admin/movie_list", {
        title: 'Movie List', movies: movies
    })
}

exports.displayMovieDetails = async function(req,res,next){
    const movie = await Movie.findById(req.params.id).populate('genres');
    console.log(movie);
    if(!movie){
        return res.status('404').send('Movie with the given ID was not found.');  
    }

    res.render("admin/movie_detail", {movie: movie})


}

exports.movieUpdateGet =async function(req,res){
    const movie = await Movie.findById(req.params.id).populate('genres');
    const genres = await Genre.find({});
    const languages = arrayToObjectArray( Movie.possibleLanguages(), "language");;
    if(movie == null) return res.staus(404).send("Movie was not found");

    for( var i = 0; i < genres.length; i++){
        for(var j = 0; j < movie.genres.length; j++){
            if(genres[i]._id.toString() == movie.genres[j]._id.toString()){
                genres[i].checked = 'checked'; 
                console.log(genres[i].checked);
            } 
        }
    }

    for (var i = 0; i < languages.length; i++ ) {
        for(var j=0; j < movie.language.length; j++){
            if(languages[i].language === movie.language[i]){
                languages[i].checked  = 'checked';
                console.log(languages[i].checked )
            }
        }
    }
   
    res.render('admin/movie_form', {title: 'Update Movie', movie: movie, genres: genres, languages: languages});

}

exports.updateMoviePost = async function(req,res){
    req.body.genres =  toArray(req.body.genres);
    let languages =  toArray(req.body.language);
    if(languages.length === 0 ){  languages.push('PL'); }
    req.body.language = languages;
      const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movies = await Movie.find({});
    const thisMovie = await Movie.findById(req.params.id);
    if(!(thisMovie.title === req.body.title) ){
        movies.forEach((movie) => {
           if(movie.title === req.body.title) return res.status(400).send("That movie has already exist");
    }) 
    return 
}

    let movie = new Movie({
        _id: req.params.id,
        title: req.body.title,
        genres: req.body.genres,
        relase_year: req.body.relase_year,
        imageURL: req.body.imageURL,
        description: req.body.description,
        duration_time: req.body.duration_time,
        language: req.body.language,
        sale_price: req.body.sale_price,
    });

    const updateMovie = await Movie.findByIdAndUpdate(  req.params.id, movie);

        res.redirect(updateMovie.url+"/details");
    
}

exports.deleteMovieGet = async function(req,res,next){
    const movie = await Movie.findById(req.params.id);
    const rental = await Rental.find({});
   
    if(!movie) res.redirect('/api/admin/movies');

    res.render('admin/movie_delete', {movie: movie, rental: rental })

}

exports.deleteMoviePost = async function(req,res){
     const movie = await Movie.findByIdAndRemove(req.body.id) ;
     if (!movie) { return res.status(404).send(" The Movie with given id doesn't exist")}
           
      res.redirect('/api/admin/movies');
    };


const toArray = function(value){
    if (!(value instanceof Array)) {
        if (typeof value === 'undefined')
            return  [];
        else
            return new Array(value);
    } 
    return value;
}

const arrayToObjectArray = function(value, nameOfValue){
    var objectArray = [];
    if (value instanceof Array) {
        for(var i = 0; i < value.length; i++){
            var object = {};
            object[nameOfValue] = value[i];
          objectArray.push(object);
        }
    }
    return objectArray;
}


