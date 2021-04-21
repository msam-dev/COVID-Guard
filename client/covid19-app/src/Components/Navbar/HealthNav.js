import { Menu } from 'antd';
import logo from '../../Assets/Images/logo.png';
import './Navbar.css';
import { logout } from './Functions';
import { useAuthUpdate } from '../AuthContext/AuthContext';

const { Item } = Menu;

const HealthNav = () => {
    const updateAuth = useAuthUpdate();

    return (
        <div >
            <Menu style ={{backgroundColor: "#0E5F76"}} mode="horizontal" >
                <Item>
                    <img width={200} src={logo} alt="Logo" />
                </Item>
                <Item  >
                    <div className='navbar-menuitem-text'>My Profile</div>
                </Item>
                <Item>
                    <div className='navbar-menuitem-text'>Add Vaccine Clinic</div>
                </Item>
                <Item>
                    <div className='navbar-menuitem-text'>Vaccinate Patient</div>
                </Item>
                <Item>
                    <div className='navbar-menuitem-text'>Positive Patient</div>
                </Item>
                <Item onClick={() => {logout(updateAuth)}} style={{float: 'right', paddingTop: '3px'}}>
                    <div className='navbar-menuitem-text'>Logout</div>
                </Item>
            </Menu>
        </div>
    );
}

export default HealthNav;