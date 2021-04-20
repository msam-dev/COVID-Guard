import { Form, Input, Button } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { layout2, tailLayout } from '../Helpers/Layouts';
import USER_TYPE from '../../../_constants/userTypes';
import { onlyNumbers } from '../../../_helpers/sharedFunctions';





const GeneralForm = props => {
    const [form] = useForm();
    const setUserState = props.setUserState;
    const numberInputs = onlyNumbers;




    
    return(
        <div>
            <div style={{textAlign: 'center', padding: '1%'}}>
                <h1 style={{color: "#0E5F76"}}>COVID Guard Register</h1>
            </div>

            <Form {...layout2} form={form}>
                <Form.Item
                    label="First Name"
                    name="firstname"
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
                    name="lastname"
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

                <Form.Item label="Phone" name="phone" style={{color: "#0E5F76"}}>
                    <Input onChange={e => {numberInputs(e, form, 'phone')}} maxLength={30}/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    style={{color: "#0E5F76"}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                            whitespace: true
                        }
                    ]}
                >
                    <Input.Password maxLength={30}/>
                </Form.Item>
    
                <Form.Item
                    label="Confirm Password"
                    name="passwordConfirm"
                    style={{color: "#0E5F76"}}
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) return Promise.resolve();
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                            validateTrigger: 'onSubmit'
                        })
                    ]}
                >
                    <Input.Password maxLength={30}/>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button  type="primary" htmlType="submit">Sign me up</Button>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <span style={{color: "#0E5F76"}}>Not you? <u style={{cursor: "pointer"}} onClick={() => { setUserState(USER_TYPE.UNREGISTERED)}}>Click here</u></span>
                </Form.Item>
            </Form>
        </div>
    );
}

export default GeneralForm;