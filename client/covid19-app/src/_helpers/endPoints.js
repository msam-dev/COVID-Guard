import axios from 'axios';

export const _login = user => {
    return axios.post('api/registeredgeneralpublic/auth/login', user);
}