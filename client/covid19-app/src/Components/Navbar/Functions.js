import USER_TYPE from '../../_constants/userTypes';
import PATH from '../../_constants/paths';
import history from '../../_helpers/history';

export const logout = updateAuth => {
    localStorage.setItem('USER', JSON.stringify({type: USER_TYPE.UNREGISTERED}));
    updateAuth({type: USER_TYPE.UNREGISTERED});
    history.push(PATH.login);
}