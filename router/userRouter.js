const express= require("express")
const router = express.Router();
const userController = require('../controller/userController');
const passport = require("passport");


router.post('/signup',userController.signUp)
.post('/login',passport.authenticate('local'),userController.login)


exports.router= router;