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

export const _registerGeneral = user => {
    return axios.post('api/registeredgeneralpublic/auth/register', user);
}

export const _registerBusiness = user => {
    return axios.post('api/businessowner/auth/register', user);
}

export const _registerHealth = user => {
    return axios.post('api/healthprofessional/auth/register', user);
}

export const _getVaccineCenters = () => {
    return axios.get('/api/generalpublic/vaccinationcentres');
}