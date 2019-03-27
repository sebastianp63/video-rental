const express = require('express');
const router = express.Router();
const shopController = require("../controllers/shopController");
const {isAuth} = require('../middleware/auth-middelware')



router.get('/', shopController.movieGetAll);
router.get('/film/:id', shopController.displayMovieDetails);

router.get('/add-to-cart/:id', shopController.addToCart);
router.get('/remove-cart-item/:id', shopController.deleteCartItem);
router.get('/cart', shopController.getCart);

router.get('/rentalCreate', isAuth,shopController.createRental);
router.get('/myprofile', isAuth,shopController.myProfile);


module.exports = router;