import GeneralNav from './GeneralNav';
import BusinessNav from './BusinessNav';
import HealthNav from './HealthNav';
import UnregisteredNav from './UnregisteredNav';
import USER_TYPE from '../../_constants/userTypes';
import { useAuth } from '../AuthContext/AuthContext';

//need to add user auth logic later

const Navbar = () => {
    const auth = useAuth();
    
    return(
        <div>
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