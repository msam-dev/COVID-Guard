import { Menu } from 'antd';
import logo from '../../Assets/Images/logo.png';
import './Navbar.css';
import { logout } from '../../_helpers/sharedFunctions';
import { useAuthUpdate } from '../AuthContext/AuthContext';
import history from '../../_helpers/history';
import PATH from '../../_constants/paths';

const { Item } = Menu;

const GeneralNav = () => {
    const updateAuth = useAuthUpdate();

    return (
        <div>
            <Menu style ={{backgroundColor: "#0E5F76"}} mode="horizontal" >
                <Item onClick={() => { history.push(PATH.home)}}>
                    <img width={200} src={logo} alt="Logo" />
                </Item>
                <Item  >
                    <div className='navbar-menuitem-text'>Location Sign In</div>
                </Item>
                <Item onClick={() => {history.push(PATH.vaccineCenters)}}>
                    <div className='navbar-menuitem-text'>Vaccine Center</div>
                </Item>
                <Item onClick={() => {history.push(PATH.currentHotspots)}}>
                    <div className='navbar-menuitem-text'>Current Hotspots</div>
                </Item>
                <Item>
                    <div className='navbar-menuitem-text'>My Profile</div>
                </Item>
                <Item>
                    <div className='navbar-menuitem-text'>My Status</div>
                </Item>
                <Item  onClick={() => {logout(updateAuth)}} style={{float: 'right', paddingTop: '3px'}}>
                    <div className='navbar-menuitem-text'>Logout</div>
                </Item>
            </Menu>
        </div>
    );
}

export default GeneralNav;