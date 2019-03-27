const { Movie, validate } = require('../models/movie');
const { Rental } = require('../models/rental');
const Cart = require('../models/cart');



exports.movieGetAll = async function(req,res){
    const movies = await Movie.find()
    .sort('name');
    res.render("user/home", {
        title: 'Movie List', movies: movies, path: 'home'
    })
}

exports.displayMovieDetails = async function(req,res,next){
    const movie = await Movie.findById(req.params.id).populate('genres');
    if(!movie){
        return res.status('404').send('Movie with the given ID was not found.');  
    }

    res.render("user/movie", {movie: movie})

}

exports.addToCart = async function(req,res,next){

    var cart = new Cart(req.session.cart ? req.session.cart : {items:{}} );

    const movie = await Movie.findById(req.params.id).populate('genres');
    if(!movie){
        return res.status('404').send('Movie with the given ID was not found.');  
    }
    const isExisting = cart.isExist(movie.id);

        if(!isExisting)
        {
            cart.add(movie,movie.id);
            req.session.cart = cart;
            res.render("user/movie", {movie: movie, cartMessage: "Dodano do koszyka"})
            return

        }
        res.render("user/movie", {movie: movie, cartMessage: "Produkt jest juz w koszyku"})

 }

 exports.deleteCartItem = function(req,res,next){
        const itemId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {items:{}} );

        cart.deleteItem(itemId);
        req.session.cart = cart;
        res.redirect("/cart");
 }



exports.getCart = function(req,res,next){
    if(!req.session.cart){
        return res.render('user/cart', {products: []});
    }
    const cart = new Cart(req.session.cart)
    const totalPrice = cart.totalPrice.toFixed(2);
    
    console.log(cart.generateArray())
    console.log(cart.generateArray().length)
    res.render ('user/cart', {products: cart.generateArray() || [] , totalPrice: totalPrice})
    

}

exports.createRental = function(req,res,next) {
    let rental = new Rental({
        user: {
            email: req.user.email,
            userId: req.user._id
          },
        cart: req.session.cart
    })

    console.log(rental);

    rental.save( (err, rental) => {
        if (err) return next(err);
        console.log(rental);
        req.session.cart = {totalQty: 0};
     res.redirect('/')

    })
    

}

exports.myProfile = function(req,res,next){
    console.log(req.user._id)
    Rental.find({'user.userId': req.user._id}, function(err,rentals){
       
        if(err) return next(err);
        let cart; 
        rentals.forEach(function(rental){
            cart = new Cart(rental.cart);
            // console.log("Cart:" , cart.generateArray())

            rental.items = cart.generateArray()
            console.log(rental.items)
        });

        res.render('user/myprofile',{rentals: rentals});
        //res.send({ rentals: rentals});
    })
}

function formatDate( date){
    const day = date.getDay()
    const month = date.getMonth()
    const year = date.getYear()

    return `${day}-${month}-${year}`

}


