const {Video, User} = require('../database');
var jwt = require('jsonwebtoken');

async function getUserId(username) {
    var user = await User.findOne({where: {username: username}});
    if(user != null) {
        return user.id;
    }
    else {
        return new Error("User does not exist");
    }
}

exports.create = async (req, res) => {
    var token = req.query.token;
    jwt.verify(token, process.env.BACKEND_SECRET, async function(err, decoded) {
        if(!err) {
            try {
                var video = await Video.findOne({where: {link: req.query.link}});
                if(video === null) {
                    var userId = await getUserId(decoded.username);
                    await Video.create({
                        link: req.query.link,
                        categoryId: req.query.categoryId,
                        favorite: req.query.favorite,
                        userId: userId
                    });
                    console.log(`Added video to user ${decoded.username}`);
                    return res.status(200).send({
                        message: "Video added"
                    });
                }
                else {
                    return res.status(400).send({
                        message: "User already has this video saved"
                    });
                }
            }
            catch(_e) {
                return res.status(400).send({
                    message: "Failed to create video, ensure that all parameters are included"
                });
            }
        }
        else {
            res.send(err);
        }
    });
}

exports.getAll = async (req, res) => {
    //TODO - make this return X at a time. Pass it an index to start with and it'll return index..(index + X) or the end if it reaches that
    //Will need to return the list and the total # of videos so you know if you need to request again if you want the rest
    var token = req.query.token;
    jwt.verify(token, process.env.BACKEND_SECRET, async function(err, decoded) {
        if(!err) {
            let userId = await getUserId(decoded.username);
            let videos = await Video.findAll({where: {userId: userId}});
            return res.status(200).send({
                videos: videos
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
                let userId = await getUserId(decoded.username);
                await Video.destroy({where: {userId: userId, link: req.query.link}});
                return res.status(200).send({
                    message: "Video removed"
                });
            }
            catch(_e) {
                return res.status(400).send({
                    message: "Failed to delete video, ensure that all parameters are included"
                });
            }
        }
        else {
            res.send(err);
        }
    });
}

exports.deleteAll = async (req, res) => {
    // TODO
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