import { Route, Redirect } from 'react-router';
import { useAuth } from './AuthContext'; 
import  USER_TYPE  from '../_constants/userTypes';

export const GeneralPrivateRoute = ({component: Component, ...rest}) => {
    const auth = useAuth();
    return (
        <Route {...rest} render={props => (
            auth === USER_TYPE.GENERAL ?
                <Component {...props} />
            : <Redirect to="/" />
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
