const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'videotrackerDB.sqlite'
})

const Model = Sequelize.Model;

class Category extends Model {}
Category.init({
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "category"
});

class Video extends Model{}
Video.init({
    link: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    categoryId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    path: {
        type: Sequelize.STRING,
        allowNull: true
    },
    favorite: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "video"
});

class User extends Model{}
User.init({
    lastLogin: {
        type: Sequelize.DATE,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    hashedPassword: {
        type: Sequelize.STRING,
        allowNull: false
    },
    salt: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "user"
});
User.hasMany(Video);

sequelize.sync().then(() => {
    console.log("Database and tables ready");
});

module.exports = {
    Category,
    Video,
    User
}