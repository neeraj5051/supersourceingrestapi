const { User } = require('../models');
const authService = require('../services/auth.service');
const nodemailer = require('../config/nodemailer.config');
const { to, ReE, ReS } = require('../services/util.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');

//signup for a new user
const signup = async function (req, res) {
    let request_params = req.body;
    if (!request_params)
        return ReE(res, 'Invalid request.');
    // if (!request_params.email && !request_params.mobile) {
    if (!request_params.email) {
        console.log('asdf');
        return ReE(res, 'Please enter an email to signup.');
    } else if (!request_params.password) {
        return ReE(res, 'Please enter a password to signup.');
    } else {
        let err, user;

        request_params.email_verification_code = Math.floor((Math.random() * 100) + 54);
        [err, user] = await to(authService.createUser(request_params));
        if (err) return ReE(res, err, 422);
        nodemailer.sendConfirmationEmail(
            user.getJWT(),
            `${request_params.email}`,
            request_params.email_verification_code
        );
        return ReS(res, { message: 'Successfully created new user.', user: user.toWeb(), token: user.getJWT() }, 201);
    }
}
module.exports.signup = signup;

const confirmEmail = async function (req, res) {
    const { _token } = req.params;
    const { verificationcode } = req.query;
    let user, err;

    let decoded;
    try {
        decoded = jwt.verify(_token, CONFIG.jwt_encryption);
        console.log(decoded)
    } catch (err) {
        console.log('err', err)
    }

    if (!decoded)
        return ReE(res, 'Invalid URL.');
    [err, user] = await to(User.findOne({ where: { id: decoded.user_id } }));
    if (err) TE(err.message);

    if (req.query.verificationcode == user.email_verification_code) {
        // console.log("email is verified");
        user.update({ email_verification_code: null });
        return ReS(res, { message: 'email is verified successfully.' }, 200);
    }
    else {
        console.log("email is not verified");
        return ReE(res, 'email is not verified.', 422);
    }
}
module.exports.confirmEmail = confirmEmail;


const login = async function (req, res) {
    const body = req.body;
    let err, user;
    [err, user] = await to(authService.authUser(req.body));
    if (err) return ReE(res, err, 200);
    if (user.email_verification_code) {
        return ReE(res, 'Please Verify your email first.', 422);
    } else {
        return ReS(res, { token: user.getJWT(), user: user.toWeb() });
    }
}
module.exports.login = login;




