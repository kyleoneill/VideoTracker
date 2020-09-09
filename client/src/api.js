const axios = require('axios');

exports.createUser = async (username, password) => {
    return axios.post(`/api/user/create?username=${username}&password=${password}`);
}

exports.login = async (username, password) => {
    return axios.post(`/api/user/login?username=${username}&password=${password}`);
}