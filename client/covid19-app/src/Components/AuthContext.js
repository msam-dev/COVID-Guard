import { useState, useContext, createContext } from "react"
import  USER_TYPE  from '../_constants/userTypes';

const AuthContext = createContext();
const AuthUpdateContext = createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function useAuthUpdate(){
    return useContext(AuthUpdateContext);
}

const initialAuth = () => {
    const user = JSON.parse(localStorage.getItem('USER'));
    if(user === null) return USER_TYPE.UNREGISTERED;
    return user.type;
}

const AuthProvider = ({children}) => {
    const [authType, setAuthType] = useState(initialAuth());

    const updateAuth = TYPE => {
        setAuthType(TYPE);
    }

    return(
        <AuthContext.Provider value={authType}>
            <AuthUpdateContext.Provider value={updateAuth}>
                {children}
            </AuthUpdateContext.Provider>
        </AuthContext.Provider>
    );
}

export default AuthProvider;