const express= require("express")
const router = express.Router();
const slotController = require('../controller/slotController');
const passport = require("passport");


router.post('/create',passport.authenticate('jwt'),slotController.createSlot)
.get('/free',passport.authenticate('jwt'),slotController.freeSlots)
.patch('/book/:id',passport.authenticate('jwt'),slotController.bookSlot)
.get('/pendingSessions',passport.authenticate('jwt'),slotController.pendingSession)

exports.router= router;