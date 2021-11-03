const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');
const ProductController = require('../controllers/product.controller');

const passport = require('passport');
const path = require('path');


require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({ status: "success", message: "Parcel Pending API", data: { "req_host": req.hostname, "real_host": process.env.APP_HOST } })
});

router.post('/registration', UserController.signup);
router.get('/userconfirmation/:_token', UserController.confirmEmail); //register a new user
router.post('/login', UserController.login); //login a user
router.get('/product', ProductController.getAll);
router.post('/product', passport.authenticate('jwt', { session: false }), ProductController.create);// Create
router.post('/get-product', passport.authenticate('jwt', { session: false }), ProductController.getUserproducts);
router.put('/product/:id', passport.authenticate('jwt', { session: false }), ProductController.update);// update
router.delete('/product/:id', passport.authenticate('jwt', { session: false }), ProductController.remove);
router.post('/assign-product', passport.authenticate('jwt', { session: false }), ProductController.createUserProduct);// Create

module.exports = router;