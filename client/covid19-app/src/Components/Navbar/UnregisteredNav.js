import { Menu } from 'antd';
import logo from '../../Assets/Images/logo.png';
import './Navbar.css';

const { Item } = Menu;

const UnregisteredNav = () => {

    return (
        <div >
            <Menu style ={{backgroundColor: "#0E5F76"}} mode="horizontal" >
                <Item>
                    <img width={200} src={logo} alt="Logo" />
                </Item>
                <Item  >
                    <div className='navbar-menuitem-text'>Location Sign In</div>
                </Item>
                <Item>
                    <div className='navbar-menuitem-text'>Vaccine Center</div>
                </Item>
                <Item>
                    <div className='navbar-menuitem-text'>Current Hotspots</div>
                </Item>
                <Item>
                    <div className='navbar-menuitem-text'>Check Status</div>
                </Item>
                <Item style={{float: 'right', paddingTop: '3px'}}>
                    <div className='navbar-menuitem-text'>Login/Register</div>
                </Item>
            </Menu>
        </div>
    );
}

export default UnregisteredNav;