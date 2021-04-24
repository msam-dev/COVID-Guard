import { Route, Redirect } from 'react-router';
import { useAuth } from '../AuthContext/AuthContext'; 
import USER_TYPE  from '../../_constants/userTypes';
import PATH from '../../_constants/paths';

export const GeneralPrivateRoute = ({component: Component, ...rest}) => {
    const user = useAuth();
    return (
        <Route {...rest} render={props => (
            user.type === USER_TYPE.GENERAL ?
                <Component {...props} />
            : <Redirect to={PATH.login} />
        )} />
    );
};

export const HealthPrivateRoute = ({component: Component, ...rest}) => {
    const auth = useAuth();
    return (
        <Route {...rest} render={props => (
            auth === USER_TYPE.HEALTH ?
                <Component {...props} />
            : <Redirect to="/" />
        )} />
    );
};

export const BusinessPrivateRoute = ({component: Component, ...rest}) => {
    const auth = useAuth();
    return (
        <Route {...rest} render={props => (
            auth === USER_TYPE.BUSINESS ?
                <Component {...props} />
            : <Redirect to="/" />
        )} />
    );
};
