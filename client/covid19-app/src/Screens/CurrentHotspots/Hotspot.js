import monthNames from '../../_constants/months';
import { Menu, Dropdown } from 'antd';
import GoogleMap from '../../Components/GoogleMap/GoogleMap';
import { useState } from 'react';


const Hotspot = props => {
    const [mapVisible, setVisible] = useState(false);
    
    const city = props.city;
    const state = props.state;
    const postCode = props.postCode;
    const venueName = props.venueName;
    const addressLine1 = props.addressLine1;
    const addressLine2 = props.addressLine2;
    const date = props.dateMarked;
    const dataFormatted = `As of ${date.getDate()}th ${monthNames[date.getMonth()]} ${date.getFullYear()}`;

    const googleMapProps = {
        lat: -33.8688,
        lng: 151.2093,
        size: '300px',
        userLetter: venueName[0],
        markerColour: "#0E5F76"
    }

    const addressMenu = (
        <Menu>
            <Menu.Item >
                <div>
                    <GoogleMap {...googleMapProps}/>
                </div>    
            </Menu.Item>
        </Menu>
    );

    return(
        <div style ={{justifyContent: 'space-between', fontSize: "20px", color: "#0E5F76" }} id="current-hotspot-flexbox">
            <div>
                <b>{city}</b>
                <span>, {state} {postCode}</span>
            </div>

            <div>
                <b>{venueName}</b>
                <span>, {addressLine2} {addressLine1}</span>
            </div>

            <span>{dataFormatted}</span>

            <Dropdown 
                overlay={addressMenu} 
                placement="bottomRight"
                visible={mapVisible} 
                title="Map" 
                onVisibleChange={ flag => { setVisible(flag) }}
            >
                <u id="current-hotspot-map">Map</u>
            </Dropdown>
        </div>
    );
}

export default Hotspot;
