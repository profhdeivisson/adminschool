import API from '../api/axios';

export function postLogin(data) {
    return new Promise((resolve, reject) => {
        API.post('/users/login', data)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error.response || error);
            });
    })
}