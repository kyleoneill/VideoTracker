const {Video, User, Category} = require('../database');
const {getUserId} = require('../common');
const axios = require('axios');
var jwt = require('jsonwebtoken');

async function getVideoName(vidId) {
    try {
        var url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${vidId}&key=${process.env.YOUTUBE_API}`
        var res = await axios.get(url);
        var title = res.data.items[0].snippet.title;
        return title;
    }
    catch(e) {
        console.log(e);
        return e;
    }
}

//token, link, categoryName, favorite
exports.create = async (req, res) => {
    var token = req.query.token;
    jwt.verify(token, process.env.BACKEND_SECRET, async function(err, decoded) {
        if(!err) {
            try {
                var video = await Video.findOne({where: {link: req.query.link}});
                if(video === null) {
                    var userId = await getUserId(decoded.username);
                    var category = await Category.findOne({where: {name: req.query.categoryName}});
                    var name = await getVideoName(req.query.link);
                    if(category !== null) {
                        let newVideo = await Video.create({
                            link: req.query.link,
                            categoryId: category.id,
                            favorite: req.query.favorite,
                            userId: userId,
                            name: name
                        });
                        console.log(`Added video to user ${decoded.username}`);
                        return res.status(200).send({
                            message: "Video added",
                            video: {
                                link: newVideo.link,
                                favorite: newVideo.favorite,
                                name: newVideo.name,
                                categoryId: category.name
                            }
                        });
                    }
                    else {
                        return res.status(400).send({
                            message: "Category provided does not exist"
                        });
                    }
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

//token, link, favorite
exports.setFavorite = async (req, res) => {
    var token = req.query.token;
    jwt.verify(token, process.env.BACKEND_SECRET, async function (err, decoded) {
        if(!err) {
            try {
                let userId = await getUserId(decoded.username);
                let video = await Video.findOne({where: {link: req.query.link, userId: userId}});
                if(video !== null) {
                    video.favorite = req.query.favorite;
                    video.save();
                    return res.status(200).send({
                        message: "Updated favorite for video"
                    });
                }
                else {
                    return res.status(400).send({
                        message: "Requested video does not exist" 
                    });
                }
            }
            catch(e) {
                return res.status(400).send({
                    message: "Failed to set favorite, ensure that all parameters are included"
                });
            }
        }
        else {
            res.send(err);
        }
    });
}

//token
exports.getAll = async (req, res) => {
    //TODO - make this return X at a time. Pass it an index to start with and it'll return index..(index + X) or the end if it reaches that
    //Will need to return the list and the total # of videos so you know if you need to request again if you want the rest
    var token = req.query.token;
    jwt.verify(token, process.env.BACKEND_SECRET, async function(err, decoded) {
        if(!err) {
            let userId = await getUserId(decoded.username);
            let videos = await Video.findAll({
                attributes: ['link', 'categoryId', 'favorite', 'name'],
                where: {userId: userId}
            });
            if(videos.length > 0) {
                console.log(videos[0].name)
                let categories = await Category.findAll({where: {userId: userId}});
                videos.map((vid) => vid.categoryId = categories[vid.categoryId - 1].name);
                return res.status(200).send({
                    message: `Found ${videos.length} videos`,
                    videos: videos
                });
            }
            else {
                return res.status(200).send({
                    message: "No videos found"
                });
            }
        }
        else {
            res.send(err);
        }
    });
}

//token, link
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

//token
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