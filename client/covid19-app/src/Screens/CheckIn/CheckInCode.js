

import { Form, Input, Button } from 'antd';
import { layout2 } from '../Register/Helpers/Layouts';
import { useAuth,useAuthUpdate } from '../../Components/AuthContext/AuthContext';
import { _checkIn} from '../../_helpers/endPoints';
import { useState } from 'react';
import { logout } from '../../_helpers/sharedFunctions';
import { useForm } from 'antd/lib/form/Form';

import history from '../../_helpers/history';
import PATH from '../../_constants/paths';

const data = {
    date: " ",
    businessName: " "
}

const CheckInCode = () => {
    const auth = useAuth();
    const updateAuth = useAuthUpdate();
    const [form] = useForm();
    const [loading, setLoading] = useState(false);

    const checkInUser = () => {
        setLoading(true);
        const values = {
            venueCode: document.getElementById('VenueCode').value,
        }
        _checkIn( auth.token, values)
        .then( resArr => {
        
            const res = resArr;
            console.log(res);
            setLoading(false);
            history.push(PATH.genericCheckedIn);
        })
        .catch(err => {
            console.log(err);
            if(err.response.status === 401) logout(updateAuth, auth.token, auth.type);
            setLoading(false);
        });
    }

    return(
        <div className = 'checkInMainContent' style={{maxWidth: '100%', color: '#0E5F76'}}>    
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>Location Sign In</h1>
            </div> 

            <div style = {{textAlign: 'center'}}> <br/>
                <h1 style = {{fontSize: '1.8rem', color: '#0E5F76'}}>COVID Guard Check-in</h1>
                <div style = {{fontSize: '1.2rem'}}>Please enter the 4 character code displayed by the venue  </div> <br/>
            </div>

            <Form {...layout2} onFinish={checkInUser} form = {form}>    
                <div style={{textAlign: 'center'}}>
                    
                    <Input id="VenueCode" style={{ width: 110 }} maxLength={30} placeholder="Enter Code..."/> <br/><br/>
                    <Button loading={loading} type="primary" htmlType="submit" >Submit</Button>
                </div> <br/>
            </Form>
            
        </div>
        
    );
}

export default CheckInCode;