import { useState } from "react";


const MyVaccineStatus = () => {
    const [user] = useState({firstName: "John", lastName: "James"});

    let lastName = user.lastName;
    if(user.lastName[lastName.length -1] === 's') lastName += "'";
    else lastName += "s"

    return(
        <div>
            <h1 style = {{color: "#0E5F76", textAlign: "left", backgroundColor: "#FDC500", paddingLeft: "1%"}}>My Vaccination Status</h1>
            <h1 style = {{color: "#0E5F76", padding: "2%", textAlign: "center"}}>{`${user.firstName} ${lastName} Vaccination Status`}</h1>

            <div style={{width:"380px", margin: "0 auto", color: '#0E5F76'}}>
                <div>
                    <b>Vaccine Type: </b>
                    <span>Vaccinated</span>
                </div>
                <div>
                    <b>Status: </b>
                    <span>Partial</span>
                </div>
                <div>
                    <b>Administered: </b>
                    <span>20/8/2021</span>
                </div>
                <div>
                    <b>Your Code: </b>
                    <span>HDHD7373HF73338HHH</span> 
                </div>
            </div>
        </div>
    );
}

export default MyVaccineStatus;