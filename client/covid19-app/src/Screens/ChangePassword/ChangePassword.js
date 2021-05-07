import { Form, Input, Button } from 'antd';
import { layout, tailLayout } from './layouts';
const ChangePassword =() => {
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
                        message: 'Please input valid email!',
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
                        message: 'Please input valid date!',
                        whitespace: true,
                        validateTrigger: 'onSubmit'
                    },
                    ]}
                >
                    <Input maxLength={30}/>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button style={{backgroundColor: "#0E5F76",color:"white"}}>Change Password</Button>
                    
                </Form.Item>

            </Form>

        </div>
    );
}

export default ChangePassword;