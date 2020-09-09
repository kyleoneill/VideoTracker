var express = require('express');
var router = express.Router();

//Controllers
const users = require('../controllers/userController');
const videos = require('../controllers/videoController');
const categories = require('../controllers/categoryController');

router.get('/', function(req, res) {
    res.send("API is working properly");
});

// TODO - there is a lot of boilerplate in the methods, can I reuse code here?

router.post('/user/create', users.create);
router.post('/user/login', users.login);
//logout is not needed. When logging out just delete the token on the client side

router.post('/video/create', videos.create);
router.get('/video', videos.getAll);
router.delete('/video', videos.deleteAll);
router.delete('/video/single', videos.deleteOne);

router.post('/category/create', categories.create);
router.get('/category/single', categories.getOne);
router.delete('/category/single', categories.deleteOne);
router.get('/category', categories.getAll);
router.delete('/category', categories.deleteAll);

module.exports = router;