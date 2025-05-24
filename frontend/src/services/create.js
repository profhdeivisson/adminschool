import API from '../api/axios';

export function createUser(data) {
    return new Promise((resolve, reject) => {
        API.post('/users/register', data)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error.response || error);
            });
    })
}