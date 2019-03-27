const {User} = require("../models/user");

module.exports.locals = (req, res, next) => {
    res.locals.session =  req.session
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.admin = req.session.isAdmin
    if(req.session.user){
      res.locals.loggedUserName = req.session.user.name;
    }
    next();
};
  
  
module.exports.isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
  
};


module.exports.isAdmin = function (req, res, next) { 
 //   const is = req.user.isAdmin == undefined ? false: req.user.isAdmin == undefined;
    if (!req.session.isAdmin) return res.status(403).send('Access denied.');
    next();
  }