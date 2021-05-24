
import { Button } from 'antd';
import history from '../../_helpers/history';
import PATH from '../../_constants/paths';

const CheckedIn = (date, businessName) => {

    const data = {
        CheckInDate: date,
        BusinessName: businessName,
    }

    return(
        <div className = 'checkInMainContent' style={{maxWidth: '100%', color: '#0E5F76'}}>
            
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>CheckedIn</h1>
            </div> 
                <div style = {{textAlign: 'center', fontSize: '1.2rem'}}> <br/>
                    <h1 style = {{fontSize: '1.8rem', color: '#0E5F76'}}>{data.businessName} </h1>
                    
                    <div><b>Checked-In:</b></div>
                    <div>{data.date}</div> <br/>
                    <Button onClick={() => {history.push(PATH.checkInCodeUnregistered)}} type="primary" > New Check-In Location</Button>
                </div>
                
        </div>                                                                      

    );
}

export default CheckedIn;