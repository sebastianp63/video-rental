const { Genre, validate } = require('../models/genre');
const {Movie} = require('../models/movie');



exports.genreGetAll = async function (req, res) {
    const genres = await Genre.find()
        .sort('name');
        res.render("admin/genre_list", {
            title: 'Genre List', genres: genres
        })
}

exports.displayGenreDetails = async function (req, res){

    const genre = await Genre.findById(req.params.id);
    if (!genre) { return res.status('404').send('Genre with the given ID was not found.');  }
    const movies = await Movie
    .find({'genres':  req.params.id})
    .select({title: 1});
   
    res.render("admin/genre_detail", {
        title: "Genre Details", genre: genre, movies: movies 
    });


}
exports.genreCreateGet = async function(req, res, next)
 {
    res.render('admin/genre_form', { title: 'Create Genre'});
};

exports.genreCreatePost = async function (req, res, next) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });

    Genre.findOne({ 'name': req.body.name })
        .exec(async function (err, foundGenre) {
            if (err) return next(err);
                
            if (foundGenre) {
                res.status(400).send("This tape of genre have already exist");
            }
            else {
                genre = await genre.save();
                res.redirect('/api/admin/genres');
            }
        });
}


exports.deleteGenreGet = async function (req, res, next) {
const genre = await Genre.findById(req.params.id);
const movies = await Movie.find({'genres': req.params.id });

if(!genre) res.redirect('/api/admin/genres');

res.render('admin/genre_delete', {genre: genre, movies: movies })

}

exports.deleteGenrePost = async function(req,res){
    const genre = await Genre.findByIdAndRemove(req.body.id) 
        if (!genre) { return res.status(404).send(" The Genre with given id doesn't exist")}
       
        res.redirect('/api/admin/genres');
};



exports.updateGenreGet = async function(req,res){

    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send("Genre not foud")
    
    res.render('admin/genre_form',{title: 'Update genre', genre: genre})


}

exports.updateGenrePost = async function(req,res){
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const genres = await Genre.find({});
    let duplicatedGenre; 

    genres.forEach((genre) => {
        console.log( `${genre.name} === ${req.body.name}`)
        if(genre.name === req.body.name) duplicatedGenre = true;
        
    })
    if(duplicatedGenre)  return res.status(400).send("That genre has already exist");

    let updateGenre = new Genre({ _id: req.params.id,name: req.body.name});
        updateGenre = await Genre.findByIdAndUpdate(
        req.params.id, updateGenre);

    res.redirect(updateGenre.url+"/details");
    
}
