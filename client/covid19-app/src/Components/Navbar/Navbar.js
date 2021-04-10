//import GeneralNav from './GeneralNav';
//import BusinessNav from './BusinessNav';
//import HealthNav from './HealthNav';
import UnregisteredNav from './UnregisteredNav';

//need to add user auth logic later

const Navbar = () => {

    return(
        <div>
            <UnregisteredNav />
        </div>
    );
}

export default Navbar;