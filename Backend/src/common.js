const {User} = require('./database');
exports.getUserId = async (username) => {
    var user = await User.findOne({where: {username: username}});
    if(user != null) {
        return user.id;
    }
    else {
        return new Error("User does not exist");
    }
}