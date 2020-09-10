const {Category, Video} = require('../database');
var jwt = require('jsonwebtoken');

async function getCategoryId(categoryName) {
    var category = await Category.findOne({where: {name: categoryName}});
    if(category != null) {
        return category.id;
    }
    else {
        return new Error("Category does not exist");
    }
}

//categoryName, token
exports.create = async (req, res) => {
    var token = req.query.token;
    jwt.verify(token, process.env.BACKEND_SECRET, async function(err, decoded) {
        if(!err) {
            try {
                let category = await Category.findOne({where: {name: req.query.categoryName}});
                if(category === null) {
                    await Category.create({
                        name: req.query.categoryName
                    });
                    return res.status(200).send({
                        message: "Category added"
                    });
                }
                else {
                    return res.status(400).send({
                        message: "Category already exists"
                    });
                }
            }
            catch(_e) {
                return res.status(400).send({
                    message: "Failed to create category, ensure that all parameters are included"
                });
            }
        }
        else {
            res.send(err);
        }
    });
}

exports.getOne = async (req, res) => {
    // TODO
    var token = req.query.token;
    jwt.verify(token, process.env.BACKEND_SECRET, async function(err, decoded) {
        if(!err) {
            return res.status(501).send({
                message: "Get one has not yet been implemented"
            });
        }
        else {
            res.send(err);
        }
    });
}

exports.getAll = async (req, res) => {
    var token = req.query.token;
    jwt.verify(token, process.env.BACKEND_SECRET, async function(err, decoded) {
        if(!err) {
            let categories = await Category.findAll();
            return res.status(200).send({
                categories: categories
            });
        }
        else {
            res.send(err);
        }
    });
}

exports.deleteOne = async (req, res) => {
    var token = req.query.token;
    jwt.verify(token, process.env.BACKEND_SECRET, async function(err, decoded) {
        if(!err) {
            try {
                let categoryId = await getCategoryId(req.query.categoryName);
                if(typeof(categoryId) != 'number') {
                    return res.status(400).send({
                        message: "Category does not exist"
                    })
                }
                let count = await Video.findAndCountAll({where: {categoryId: categoryId}});
                if(count.count == 0) {
                    await Category.destroy({where: {id: categoryId}});
                    return res.status(200).send({
                        message: "Category removed"
                    });
                }
                else {
                    return res.status(409).send({
                        message: "Cannot remove a category when videos are still using it"
                    });
                }
            }
            catch(_e) {
                return res.status(400).send({
                    message: "Failed to delete category, ensure that all parameters are included"
                });
            }
        }
        else {
            res.send(err);
        }
    });
}

exports.deleteAll = async (req, res) => {
    var token = req.query.token;
    jwt.verify(token, process.env.BACKEND_SECRET, async function(err, decoded) {
        if(!err) {
            return res.status(501).send({
                message: "Delete all has not yet been implemented"
            });
        }
        else {
            res.send(err);
        }
    });
}