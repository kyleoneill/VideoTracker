const axios = require('axios');

exports.createUser = async (username, password) => {
    return axios.post(`/api/user/create?username=${username}&password=${password}`);
}

exports.login = async (username, password) => {
    return axios.post(`/api/user/login?username=${username}&password=${password}`);
}

exports.getAllVideos = async(token) => {
    return axios.get(`/api/video?token=${token}`);
}

exports.createVideo = async(link, categoryName, favorite, token) => {
    return axios.post(`/api/video/create?link=${link}&categoryName=${categoryName}&favorite=${favorite}&token=${token}`);
}

exports.deleteVideo = async(link, token) => {
    return axios.delete(`/api/video/single?link=${link}&token=${token}`);
}

exports.setVideoFavorite = async(link, favorite, token) => {
    return axios.put(`/api/video/set_favorite?link=${link}&favorite=${favorite}&token=${token}`);
}

exports.getAllCategories = async(token) => {
    return axios.get(`/api/category?token=${token}`);
}