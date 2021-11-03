const { Products, UserProduct, Category } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const createUserProduct = async function (req, res) {
    let err, userproduct;
    let user = req.user;
    let req_param = req.body;

    if (!req_param.product_ids)
        return ReE(res, 'product ids required.');
    let user_product = [];

    req_param.product_ids.forEach(ele => {
        user_product.push({
            user_id: user.id,
            product_id: ele
        })
    });
    // //insert product 
    [err, userproduct] = await to(UserProduct.bulkCreate(user_product));
    if (err) return ReE(res, err, 422);

    return ReS(res, { message: 'Products Assign to user successfully.' }, 201);
}
module.exports.createUserProduct = createUserProduct;

const create = async function (req, res) {
    let err, product, userproduct;
    let user = req.user;
    let req_param = req.body;
    if (!req_param.name)
        return ReE(res, 'Product name is required.');
    //insert product 
    [err, product] = await to(Products.create({
        name: req_param.name,
        description: req_param.description,
        category: req_param.category,
        brand: req_param.brand,
        status: 1
    }));
    if (err) return ReE(res, err, 422);

    [err, userproduct] = await to(UserProduct.create({ user_id: user.id, product_id: product.id }));
    if (err) return ReE(res, err, 422);

    return ReS(res, { message: 'Product added successfully.' }, 201);
}
module.exports.create = create;

const getAll = async function (req, res) {
    let err, products;


    [err, products] = await to(Products.findAll({
        order: [
            ['id', 'DESC']
        ]
    }));
    //if (err) return ReE(res, err, 422);
    return ReS(res, { products: products });
}
module.exports.getAll = getAll;

const getUserproducts = async function (req, res) {
    let err, products;
    const { body, user } = req;
    const { filters } = body;

    let whereStatement = {};
    if (filters && filters.category) {
        whereStatement = {
            category: filters.category
        }
    }
    if (filters && filters.brand) {
        whereStatement = {
            brand: filters.brand
        }
    }

    [err, products] = await to(Products.findAll({
        where: whereStatement,
        include: [{
            model: UserProduct,
            where: {
                user_id: user.id
            }
        }],
        order: [
            ['id', 'DESC']
        ]
    }));
    if (err) return ReE(res, err, 422);
    return ReS(res, { products: products });
}
module.exports.getUserproducts = getUserproducts;


const update = async function (req, res) {
    let err, product;
    let req_param = req.body;
    const { id } = req.params;
    if (!id) {
        return ReE(res, { "error": "Product Id is required" });
    }
    [err, product] = await to(Products.findOne({ where: { id: id } }));
    // console.log(product);
    if (!product) return ReE(res, "Product not found with id: " + id);

    let update_product = {
        name: req_param.name,
        description: req_param.description,
        category: req_param.category,
        brand: req_param.brand,
    };
    product.set(update_product);
    [err, product] = await to(product.save());
    if (err) {
        return ReE(res, err);
    }
    return ReS(res, { message: 'Product updated successfully' }, 200);
}
module.exports.update = update;


const remove = async function (req, res) {
    let product, err;
    let product_id = req.params.id;
    if (!product_id) {
        return ReE(res, { "error": "Product Id is required" });
    }

    [err, product] = await to(Products.findOne({ where: { id: product_id } }));
    if (err) return ReE(res, "err finding Product");

    if (!product) return ReE(res, "Product not found with id: " + product_id);

    product.destroy();
    if (err) return ReE(res, 'error occured trying to delete the product');

    return ReS(res, { message: 'Deleted Product' });
}
module.exports.remove = remove;

