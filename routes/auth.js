var express = require('express');
const router = express.Router();

const authController = require("../controllers/authController");


router.get('/login', authController.getSignIn)

router.post('/login', authController.postSingIn);

router.get('/registration', authController.getSignUp);

router.post('/registration', authController.postSingUp);

router.post('/logout', authController.postLogout);



module.exports = router;