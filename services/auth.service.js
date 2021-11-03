const { User } = require('../models');
const validator = require('validator');
const { to, TE } = require('../services/util.service');

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const getUniqueKeyFromBody = function (body) {// this is so they can send in 3 options unique_key, email and it will work
    let unique_key = body.unique_key;
    if (typeof unique_key === 'undefined') {
        if (typeof body.email != 'undefined') {
            unique_key = body.email
        } else {
            unique_key = null;
        }
    }
    // console.log(unique_key);
    return unique_key;
}
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

const createUser = async (userInfo) => {
    let unique_key, auth_info, err;

    auth_info = {};
    auth_info.status = 'create';

    unique_key = userInfo.email;
    if (!unique_key) TE('An email was not entered.');

    if (validator.isEmail(unique_key)) {
        auth_info.method = 'email';
        userInfo.email = unique_key;

        [err, user] = await to(User.create({
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            email: userInfo.email,
            password: userInfo.password,
            email_verification_code: userInfo.email_verification_code
        }));
        console.log(err);
        if (err) TE('user already exists with that email');
        // console.log(user);
        return user;


    } else {
        TE('Something Went Wrong!.');
    }
}
module.exports.createUser = createUser;

const authUser = async function (userInfo) {//returns token
    // console.log(userInfo);
    let unique_key;
    let auth_info = {};
    auth_info.status = 'login';
    unique_key = getUniqueKeyFromBody(userInfo);

    if (!unique_key) TE('Please enter an email to login');


    if (!userInfo.password) TE('Please enter a password to login');

    let user;
    if (validator.isEmail(unique_key)) {
        auth_info.method = 'email';
        [err, user] = await to(User.findOne({ where: { email: unique_key } }));
        if (err) TE(err.message);

    } else {
        TE('A valid emailwas not entered');
    }

    if (!user) TE('Email Not registered');

    [err, user] = await to(user.comparePassword(userInfo.password));

    if (err) TE(err.message);

    return user;

}
module.exports.authUser = authUser;