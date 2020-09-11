const {Category, Video} = require('../database');
const {getUserId} = require('../common');
var jwt = require('jsonwebtoken');

async function getCategoryId(categoryName, userId) {
    var category = await Category.findOne({where: {name: categoryName, userId: userId}});
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
                var userId = await getUserId(decoded.username);
                let category = await Category.findOne({where: {name: req.query.categoryName, userId: userId}});
                if(category === null) {
                    let category = await Category.create({
                        name: req.query.categoryName,
                        userId: userId
                    });
                    return res.status(200).send({
                        message: "Category added",
                        category: {
                            name: category.name,
                            createdAt: category.createdAt
                        }
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

//token
exports.getAll = async (req, res) => {
    var token = req.query.token;
    jwt.verify(token, process.env.BACKEND_SECRET, async function(err, decoded) {
        if(!err) {
            var userId = await getUserId(decoded.username);
            let categories = await Category.findAll({
                attributes: ['name', 'createdAt'],
                where: {userId: userId}
            });
            return res.status(200).send({
                categories: categories
            });
        }
        else {
            res.send(err);
        }
    });
}

//token, categoryName
exports.deleteOne = async (req, res) => {
    var token = req.query.token;
    jwt.verify(token, process.env.BACKEND_SECRET, async function(err, decoded) {
        if(!err) {
            try {
                var userId = await getUserId(decoded.username);
                let categoryId = await getCategoryId(req.query.categoryName, userId);
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