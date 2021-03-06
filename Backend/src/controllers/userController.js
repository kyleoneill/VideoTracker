const {User} = require('../database');
const crypto = require('crypto');
var jwt = require('jsonwebtoken');

function generateToken(username) {
    return jwt.sign({username: username}, process.env.BACKEND_SECRET, {expiresIn: "2 days"});
}

exports.create = async (req, res) => {
    try {
        var shouldBeEmptyUser = await User.findOne({where: {username: req.query.username}});
        if(shouldBeEmptyUser === null) {
            //TODO password constraints
            var salt = crypto.randomBytes(32).toString('base64');
            var shasum = crypto.createHash('sha256');
            var hashedPassword = shasum.update(req.query.password + salt).digest('base64');
            User.create({
                username: req.query.username,
                hashedPassword: hashedPassword,
                salt: salt,
                lastLogin: new Date()
            }).then((_value) => {
                console.log(`Created new user with username ${req.query.username}`);
                var token = generateToken(req.query.username);
                return res.status(200).send({
                    message: "Account created",
                    token: token
                });
            });
        }
        else {
            return res.status(409).send({
                message: "This username is taken"
            });
        }
    }
    catch {
        return res.status(400).send({
            message: "A username and password must be included"
        });
    }
};

exports.login = (req, res) => {
    var queryUsername = req.query.username;
    var queryPassword = req.query.password;
    User.findOne({where: {username: queryUsername}}).then((user) => {
        if(user === null) {
            return res.status(401).send({
                message: "Username does not exist"
            })
        }
        else {
            var shasum = crypto.createHash('sha256');
            var hashedPassword = shasum.update(queryPassword + user.salt).digest('base64');
            if(hashedPassword === user.hashedPassword) {
                user.lastLogin = new Date();
                user.save();
                var token = generateToken(queryUsername);
                return res.status(200).send({
                    message: "User logged in",
                    token: token
                })
            }
            else {
                return res.status(401).send({
                    message: "Incorrect password"
                })
            }
        }
    });
};

//newPassword, currentPassword, token
exports.changePassword = (req, res) => {
    var token = req.query.token;
    jwt.verify(token, process.env.BACKEND_SECRET, async function(err, decoded) {
        if(!err) {
            try {
                var user = await User.findOne({where: {username: decoded.username}});
                var shasum = crypto.createHash('sha256');
                var passwordToCheck = shasum.update(req.query.currentPassword + user.salt).digest('base64');
                if(passwordToCheck === user.hashedPassword) {
                    shasum = crypto.createHash('sha256');
                    var newHashedPassword = shasum.update(req.query.newPassword + user.salt).digest('base64');
                    user.hashedPassword = newHashedPassword;
                    await user.save();
                    return res.status(200).send({
                        message: "Successfully changed password"
                    });
                }
                else {
                    return res.status(400).send({
                        message: "The current password is incorrect"
                    });
                }
            }
            catch(e) {
                res.status(400).send({
                    message: "Failed to validate password"
                });
            }
        }
        else {
            return res.status(401).send({
                message: err
            });
        }
    });
}

exports.verifyToken = (req, res) => {
    var token = req.query.token;
    jwt.verify(token, process.env.BACKEND_SECRET, async function(err, decoded) {
        if(!err) {
            var token = generateToken(decoded.username);
            return res.status(200).send({
                tokenValid: true,
                newToken: token,
                username: decoded.username
            });
        }
        else {
            return res.status(401).send({
                tokenValid: false,
                newToken: null,
                username: null,
                err: err
            })
        }
    });
}
