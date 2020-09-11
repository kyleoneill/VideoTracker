const axios = require('axios');

//User
export async function createUser(username, password) {
    return axios.post(`/api/user/create?username=${username}&password=${password}`);
}

export async function login(username, password) {
    return axios.post(`/api/user/login?username=${username}&password=${password}`);
}

export async function changePassword(token, currentPassword, newPassword) {
    return axios.put(`/api/user/update_password?currentPassword=${currentPassword}&newPassword=${newPassword}&token=${token}`);
}

//Video
export async function getAllVideos(token) {
    return axios.get(`/api/video?token=${token}`);
}

export async function createVideo(link, categoryName, favorite, token) {
    return axios.post(`/api/video/create?link=${link}&categoryName=${categoryName}&favorite=${favorite}&token=${token}`);
}

export async function deleteVideo(link, token) {
    return axios.delete(`/api/video/single?link=${link}&token=${token}`);
}

export async function setVideoFavorite(link, favorite, token) {
    return axios.put(`/api/video/set_favorite?link=${link}&favorite=${favorite}&token=${token}`);
}

//Category
export async function getAllCategories(token) {
    return axios.get(`/api/category?token=${token}`);
}

export async function createCategory(token, categoryName) {
    return axios.post(`/api/category/create?categoryName=${categoryName}&token=${token}`);
}

export async function deleteCategory(token, categoryName) {
    return axios.delete(`/api/category/single?categoryName=${categoryName}&token=${token}`);
}
