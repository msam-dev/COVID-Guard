import './CurrentHotspots.css';
import { Input } from 'antd';
import Hotspot from './Hotspot';
import { useState } from 'react';
import { filterHotspots } from './Functions';


let dataArray = [];

for(let i = 0; i < 100; i++){
    const data = {
        city: "Wollongong",
        state: "NSW",
        postCode: 1500 + i + "",
        venueName: "Mr Crown",
        addressLine1: "90 Crown Street",
        addressLine2: "",
        dateMarked: new Date()
    }
    dataArray[i] = data;
}







const CurrentHotspots = () => {
    const [hotspots, setHotspots] = useState(dataArray); 
    const [hotspotsFilter] = useState(hotspots);


    



    return (
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>Current Hotspots</h1>
            </div>

            <div id="current-hotspot-upper-body">
                <div className="current-hotspots-column-left">
                    <div>
                        <span style={{color: "#0E5F76", fontSize: "28px"}}>Current National Hotspots</span>

                        <div style={{width: '300px', paddingTop: "1%"}}>
                            <Input onChange={e => { filterHotspots(e, setHotspots, hotspotsFilter) }} placeholder="Enter your post code"/>
                        </div>
                    </div>
                </div>
                
                <div  className="current-hotspots-column-right">
                    <div style={{paddingTop: "1%"}}>
                        <b style={{color: "#0E5F76", fontSize: "20px"}}>Have you been to one of these locations?</b>
                    </div>
                    <div>
                        <span style={{color: "#0E5F76"}}>
                            If you have been to any of these locations within a 2 week period, you must immediately self 
                            quarantine and ring your local state hotline and identify yourself as a potential close contact.
                        </span>
                    </div>
                </div>
            </div>
            
            <div style={{clear: "both", paddingTop: "1%"}}>
                <div id='current-hotspot-wrapper'>
                    {
                        hotspots.map((hotspot, i) => {
                            return <Hotspot key={i} {...hotspot}/>
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default CurrentHotspots;