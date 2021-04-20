import { Menu } from 'antd';
import logo_basic from '../../Assets/Images/logo_basic.png';

const { Item } = Menu;

const Footer = () => {
    return (
        <div>
            <Menu style ={{backgroundColor: "#0E5F76"}} mode="horizontal" >
                <Item  >
                    <div className='navbar-menuitem-text'>Home</div>
                </Item>
                <Item>
                    <div className='navbar-menuitem-text'>Support</div>
                </Item>
                <Item>
                    <div className='navbar-menuitem-text'>More Info</div>
                </Item>
                <Item>
                    <div className='navbar-menuitem-text'>Terms and Conditions</div>
                </Item>
                <Item style={{float: 'right'}}>
                    <img width={50} src={logo_basic} alt="Logo" />
                </Item>
            </Menu>
        </div>
    );
}

export default Footer;