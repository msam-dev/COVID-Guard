import { Form, Input, Button,Radio } from 'antd';
import { layout, tailLayout } from './layouts';
import USER_TYPE from '../../_constants/userTypes';
import { changePasswordGeneral, changePasswordBusiness, changePasswordHealth } from './Functions';
import { validateEmail } from '../../_helpers/sharedFunctions'; 
import { useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { useAuthUpdate } from '../../Components/AuthContext/AuthContext';

const ChangePassword =() => {
    
    const [loading, setLoading] = useState(false);
    const [form] = useForm();
    const updateAuth = useAuthUpdate();

 

    const changePassword = (password) => {
        const current_password = form.getFieldValue('current_password');
        const new_password = form.getFieldValue('new_password');
        const confirm_new_password = form.getFieldValue('confirm_new_password')
        const type = form.getFieldValue('type');

        /*if(!password ||  !validateEmail(email)) return Promise.resolve();*/

        const user = {
            currnet_password: current_password,
            new_password: new_password,
            confirm_new_password: confirm_new_password
        }

        setLoading(true);

        switch(type){
            case USER_TYPE.GENERAL: return changePasswordGeneral(setLoading, updateAuth, user);
            case USER_TYPE.HEALTH: return changePasswordHealth(setLoading, updateAuth, user);
            case USER_TYPE.BUSINESS: return changePasswordBusiness(setLoading, updateAuth, user);
            default : {
                setLoading(false);
                return Promise.reject(new Error('Something went wrong'));
            }
        }
    }
    

    
    return(
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>Change Password</h1>
            </div>
            
            <div>
                <h1 style={{marginTop:"5%" ,textAlign:'Center',fontWeight:'normal',color: "#0E5F76"}}>
                    Change Password
                </h1>
            </div>

            <Form {...layout}>
            <Form.Item
                    label="Current Password :"
                    name="current_password"
                    style={{color: "#0E5F76"}}
                    rules={[
                    {   
                        type: 'password',
                        required: true,
                        message: 'Please input correct password!',
                        whitespace: true,
                        validateTrigger: 'onSubmit'
                    },
                    ]}
                >
                    <Input maxLength={30}/>
                </Form.Item>

                <Form.Item
                    label="New Password :"
                    name="new_password"
                    style={{color: "#0E5F76"}}
                    rules={[
                    {   
                        type: 'password',
                        required: true,
                        message: 'Please input valid date!',
                        whitespace: true,
                        validateTrigger: 'onSubmit'
                    },
                    ]}
                >
                    <Input maxLength={30}/>
                </Form.Item>

                <Form.Item
                    label="Confirmm New Password :"
                    name="confirm_new_password"
                    style={{color: "#0E5F76"}}
                    rules={[
                    {   
                        type: 'password',
                        required: true,
                        message: 'Please input same password!',
                        whitespace: true,
                        validateTrigger: 'onSubmit'
                    },
                    ]}
                >
                    <Input maxLength={30}/>
                </Form.Item>

                <Form.Item 
                        {...layout} 
                        name="type" 
                        label="Who are you?"
                        rules={[
                            { 
                                required: true,
                                message: "Please tell us who you are!"
                            }
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={USER_TYPE.GENERAL}>General Public</Radio>
                            <Radio value={USER_TYPE.HEALTH}>Health Professional</Radio>
                            <Radio value={USER_TYPE.BUSINESS}>Venue Owner</Radio>
                        </Radio.Group>
                    </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button loading={loading} type="primary" htmlType="submit">Change Password</Button>
                    
                </Form.Item>

            </Form>

        </div>
    );
}

export default ChangePassword;