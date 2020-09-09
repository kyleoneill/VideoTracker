const axios = require('axios');

exports.createUser = async (username, password) => {
    return axios.post(`/api/user/create?username=${username}&password=${password}`);
}

exports.login = async (username, password) => {
    return axios.post(`/api/user/login?username=${username}&password=${password}`);
}

exports.getAllVideos = async(token) => {
    return axios.get(`/api/video?token=${token}`)
}

exports.getAllCategories = async(token) => {
    return axios.get(`/api/category?token=${token}`)
}