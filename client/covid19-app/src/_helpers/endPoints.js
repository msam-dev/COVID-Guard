import axios from 'axios';

export const _loginGeneral = user => {
    return axios.post('api/registeredgeneralpublic/auth/login', user);
}

export const _loginHealth = user => {
    return axios.post('api/healthprofessional/auth/login', user);
}

export const _loginBusiness = user => {
    return axios.post('api/businessowner/auth/login', user);
}