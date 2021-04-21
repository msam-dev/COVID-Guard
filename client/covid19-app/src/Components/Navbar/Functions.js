import USER_TYPE from '../../_constants/userTypes';

export const logout = updateAuth => {
    localStorage.setItem('USER', JSON.stringify({type: USER_TYPE.UNREGISTERED}));
    updateAuth({type: USER_TYPE.UNREGISTERED});
}