import GeneralNav from './GeneralNav';
import BusinessNav from './BusinessNav';
import HealthNav from './HealthNav';
import UnregisteredNav from './UnregisteredNav';
import USER_TYPE from '../../_constants/userTypes';
import { useAuth } from '../AuthContext/AuthContext';
import axios from 'axios';

//need to add user auth logic later

const Navbar = () => {
    const auth = useAuth();

    const URL = 'api/registeredgeneralpublic/auth/user';
    const headers = {
        "x-auth-token" : auth.token
    }
  
    const checkTok = () => {
       axios.get(URL, headers)
       .then(res => {
           console.log(res);
       })
       .catch(err => {
           console.log(err);
       });
    }
    
    return(
        <div>
                {/*<button onClick={checkTok}>check tok</button>*/}
            {
                auth.type === USER_TYPE.UNREGISTERED
                ? <UnregisteredNav />
                : auth.type === USER_TYPE.BUSINESS
                ? <BusinessNav />
                : auth.type === USER_TYPE.HEALTH
                ? <HealthNav /> 
                : auth.type === USER_TYPE.GENERAL
                ? <GeneralNav />
                : <UnregisteredNav />
            }
            
        </div>
    );
}

export default Navbar;