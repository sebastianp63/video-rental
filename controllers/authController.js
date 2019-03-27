const { User } = require("../models/user");
const { check, validationResult } = require('express-validator/check');
const _ = require("lodash");
const bcrypt = require('bcrypt');
const Cart = require('../models/cart');



module.exports.getSignUp = (req, res, next) => {
    if(req.session.isLoggedIn)  return res.redirect('/')
    res.render('auth/registration', {
        errorMessage: [],
        validationError: [], 
        oldData: {
            email: '',
            password: '',
            name: '',
            surname: '',
            phone_number: ''
        }
    });
}

module.exports.postSingUp = [
    
    check('email', 'Wymagane pole').not().isEmpty(),
    check('email', 'Email jest niepoprawny lub nie istnieje').isEmail(),
    check('name', 'Wymagane pole').not().isEmpty(),
    check('surname', 'Wymagane pole').not().isEmpty(),
    check('password', 'Wymagane pole').not().isEmpty(),
    check('password', 'Haslo musi miec conajmniej 6 znakow dlugosci').isLength({ min: 6 }),
    check('phone_number', 'Niepoprawny numer telefonu').optional({checkFalsy: true}).isLength({ min: 9 }),
    check('phone_number', 'Niepoprawny numer telefonu').optional({checkFalsy: true}).isLength({max: 9}),

    (req,res,next) => {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const surname = req.body.surname;
        const phone_number = req.body.phone_number;
    
        const errors = validationResult(req);
        const errorArray = errors.array();
        const inputError = {
            emailError: getErrorMessage(errorArray,'email') ,
            nameError:  getErrorMessage(errorArray,'name'),
            surnameError:  getErrorMessage(errorArray,'surname'),
            passwordError:  getErrorMessage(errorArray,'password'),
            phoneNumberError:  getErrorMessage(errorArray,'phone_number')
        }  
     
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/registration', {
                errorMessage: [],
                validationError: inputError,
                oldData: {
                    email: email,
                    password: password,
                    name: name,
                    surname: surname,
                    phone_number: phone_number,
                }
            });
        }

        User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length >= 1) {
                //req.flash('error','Uzytkownik o podanym adresie juz istnieje')
                //return res.redirect('/registration')
                return res.status(422).render('auth/registration', {
                    errorMessage: 'Uzytkownik o podanym adresie juz istnieje',
                    validationError: inputError,
                    oldData: {
                        email: email,
                        password: password,
                        name: name,
                        surname: surname,
                        phone_number: phone_number,
                    }
                });
            } else {
                const user = new User({
                    email: email,
                    password: password,
                    name: name,
                    surname: surname,
                    phone_number: phone_number,
             })

            user.save().then(result => {
                res.redirect('/login');
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
         }
     })

  }
]

module.exports.getSignIn = (req, res, next) => {
    if(req.session.isLoggedIn)  return res.redirect('/') 
    res.render('auth/login', {
        errorMessage: req.flash('error'),
        oldData:{
            email: '',
        }
    });
}

module.exports.postSingIn = [

    check('email', 'Wymagane pole').not().isEmpty(),
    check('password', 'Wymagane pole').not().isEmpty(),

 (req, res, next) =>{
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    const errorArray = errors.array(); 
    const inputError = {
        emailError: getErrorMessage(errorArray, 'email'),
        passwordError: getErrorMessage(errorArray, 'password'),
    }
        
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            errorMessage: [],
            errors: errors.mapped(),
            oldData: {
                email: email,
                password: password,
            }
        });   
     }

    User.findOne({email: email})
        .exec()
        .then(user => {
            if(!user) { 
                return res.status(422).render('auth/login', {
                    errorMessage: 'Niepoprawny email i/lub haslo',
                    validationError: inputError,
                    oldData: {
                        email: email,
                        password: password,
                    }
                });
            }
            bcrypt.
            compare(password, user.password , (err,matched) => {
                if( err) {
                    return res.redirect("/login");
                }
                if(matched){
                    
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                        if (user.isAdmin){
                            req.session.isAdmin = true;
                            return res.redirect('api/admin/');
                        } else {
                        console.log(err);
                        res.redirect('/');
                        }
                    });
                }
                 return res.status(422).render('auth/login', {
                    errorMessage: 'Niepoprawny email i/lub haslo',
                    validationError: inputError,
                    oldData: {
                        email: email,
                        password: password,
                    }
                });
            });
    })
    .catch(err => {
        console.log(err);
        next(err);
    });
}
]
exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
      console.log(err);

      res.redirect('/');

    });



};

function getErrorMessage ( array, paramName){
    const errorMsg = array.filter(e => e.param === paramName);
    if(errorMsg.length) return errorMsg[0];
    return null 
}