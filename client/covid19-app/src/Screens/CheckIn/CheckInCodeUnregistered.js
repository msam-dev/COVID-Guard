

import { Form, Input, Button } from 'antd';
import { useAuth,useAuthUpdate } from '../../Components/AuthContext/AuthContext';
import { _checkInUnregistered } from '../../_helpers/endPoints';
import { useState } from 'react';
import { logout } from '../../_helpers/sharedFunctions';
import { useForm } from 'antd/lib/form/Form';
import { layout2, tailLayout } from '../Register/Helpers/Layouts';



import history from '../../_helpers/history';
import PATH from '../../_constants/paths';

const CheckInCodeUnregistered = () => {
    const auth = useAuth();
    const updateAuth = useAuthUpdate();
    const [form] = useForm();
    const [loading, setLoading] = useState(false);
    console.log(loading);

    const checkInUser = (values) => {
        setLoading(true);
        console.log(values);

        _checkInUnregistered(values)
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
                <div style = {{fontSize: '1.2rem'}}>Please enter your personal details to Check-In </div> <br/>
            </div>

            

            <Form {...layout2} form={form}  onFinish={checkInUser} >
                
                <Form.Item
                    label="First Name"
                    name="firstName"
                    style={{color: "#0E5F76"}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your first name!',
                            whitespace: true
                        }
                    ]}
                >
                    <Input maxLength={30}/>
                </Form.Item>
        
                <Form.Item
                    label="Last Name"
                    name="lastName"
                    style={{color: "#0E5F76"}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your last name!',
                            whitespace: true
                        }
                    ]}
                >
                    <Input maxLength={30}/>
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    style={{color: "#0E5F76"}}
                    rules={[
                        {
                            required: true,
                            type: 'email',
                            message: 'Please input a valid email!',
                            whitespace: true
                        }
                    ]}
                >
                    <Input maxLength={30}/>
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    style={{color: "#0E5F76"}}
                    rules={[
                        {
                            required: true,
                            message: 'Enter phone!',
                            whitespace: true
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Check-In Code"
                    name="venueCode"
                    style={{color: "#0E5F76"}}
                    rules={[
                        {
                            required: true,
                            message: 'Enter Code Displayed by Venue!',
                            whitespace: true
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                
                
   
                <Form.Item {...tailLayout}>
                    <Button  type="primary" htmlType="submit">Check-in now</Button>
                </Form.Item>

            </Form>
            
        </div>
        
    );
}

export default CheckInCodeUnregistered;