
import './VaccineCenters.css';
import { Input } from 'antd';
import Center from './Center';
import { useState } from 'react';
import { filterCenters } from './Functions';


let dataArray = [];

for(let i = 0; i < 100; i++){
    const data = {
        city: "Wollongong",
        state: "NSW",
        postCode: 1500 + i + "",
        venueName: "Wollongong Hospital",
        addressLine1: "90 Crown Street",
        addressLine2: "",
    }
    dataArray[i] = data;
}




const VaccineCenters = () => {
    const [centers, setCenters] = useState(dataArray); 
    const [centerFilter] = useState(centers);


    



    return (
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>COVID-19 Vaccine Centers</h1>
            </div>

            <div id="vaccine-center-upper-body">
                <div className="vaccine-center-column-left">
                    <div>
                        <span style={{color: "#0E5F76", fontSize: "28px"}}>Nation wide COVID-19 Vaccination Centers</span>

                        <div style={{width: '300px', paddingTop: "1%"}}>
                            <Input onChange={e => { filterCenters(e, setCenters, centers.length, centerFilter) }} placeholder="Enter your post code"/>
                        </div>
                    </div>
                </div>
                
              
            </div>
            
            <div style={{clear: "both", paddingTop: "1%"}}>
                <div id='vaccine-center-wrapper'>
                    {
                        centers.map((center, i) => {
                            return <Center key={i} {...center}/>
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default VaccineCenters;