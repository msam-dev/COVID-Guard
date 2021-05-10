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
    return axios.get('api/generalpublic/vaccinationcentres');
}

export const _getCurrentHotspots = () => {
    return axios.get('api/generalpublic/currenthotspots');
}

export const _checkGeneralUser = token => {
    const config = { headers:{ "x-auth-token" : token }}
    return axios.get('api/registeredgeneralpublic/auth/user', config);
}

export const _checkHealthUser = token => {
    const config = { headers:{ "x-auth-token" : token }}
    return axios.get('api/healthprofessional/auth/user', config);
}

export const _checkBusinessUser = token => {
    const config = { headers:{ "x-auth-token" : token }}
    return axios.get('api/businessowner/auth/user', config);
}

export const _forgotPasswordGeneral = email => {
    return axios.post('api/registeredgeneralpublic/auth/forgotpassword', email);
}

export const _checkVaccinationValid = vaccinationCode => {
    return axios.post('api/generalpublic/checkvaccinationvalid', vaccinationCode);
}

export const _getVaccinationStatus = token => {
    const config = { headers:{ "x-auth-token" : token }}
    return axios.get('api/registeredgeneralpublic/vaccinationstatus', config);
}

export const _getGeneralProfile = token => {
    const config = { headers:{ "x-auth-token" : token }}
    return axios.get('api/registeredgeneralpublic/profile', config);
}