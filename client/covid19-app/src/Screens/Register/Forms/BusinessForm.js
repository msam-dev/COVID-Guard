import { Form, Input, Button, Select } from 'antd';
import { layout3, layout4 } from '../Helpers/Layouts'; 
import { useForm } from 'antd/lib/form/Form';
import USER_TYPE from '../../../_constants/userTypes';
import { useViewport } from '../../../_helpers/viewPort';
import { setCustLayout, handleSubmitBusiness } from '../Helpers/Functions';
import { onlyNumbers } from '../../../_helpers/sharedFunctions';

const { Option } = Select;





const BusinessForm = props => {
    const setUserState = props.setUserState;
    const [form] = useForm();
    const { width } = useViewport();
    let layoutA = layout3;
    let layoutB = layout4;

    if(width < 1400){
        layoutA = setCustLayout();
        layoutB = setCustLayout();
    }

    const handleSubmit = handleSubmitBusiness;
    const numberInputs = onlyNumbers;





    return (
        <div>
            <div style={{textAlign: 'center', padding: '1%'}}>
                <h1 style={{color: "#0E5F76"}}>COVID Guard Register</h1>
            </div>

            <div className = "register-business-column">
            <Form {...layoutA} form={form}>
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

                    <Form.Item
                        label="ABN"
                        name="abn"
                        style={{color: "#0E5F76"}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your ABN',
                                whitespace: true
                            }
                        ]}
                    >
                        <Input onChange={e => {numberInputs(e, form, 'abn')}} maxLength={30}/>
                    </Form.Item>
                </Form>
            </div>

            <div className="register-business-column">
            <Form {...layoutB} form={form}>
                    <Form.Item
                        label="Venue Name"
                        name="vanueName"
                        style={{color: "#0E5F76"}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input the name of your venue!',
                                whitespace: true
                            }
                        ]}
                    >
                        <Input maxLength={30}/>
                    </Form.Item>
            
                    <Form.Item
                        label="Address Line 1"
                        name="address1"
                        style={{color: "#0E5F76"}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input venue address!',
                                whitespace: true
                            }
                        ]}
                    >
                        <Input maxLength={30}/>
                    </Form.Item>

                    <Form.Item
                        label="Address Line 2"
                        name="address2"
                        style={{color: "#0E5F76"}}
                    >
                        <Input maxLength={30}/>
                    </Form.Item>

                    <Form.Item
                        label="Suburb"
                        name="suburb"
                        style={{color: "#0E5F76"}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input the suburb your venue is located!',
                                whitespace: true
                            }
                        ]}
                    >
                        <Input maxLength={30}/>
                    </Form.Item>

                    <Form.Item
                        label="City"
                        name="city"
                        style={{color: "#0E5F76"}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input the city your venue is located!',
                                whitespace: true
                            }
                        ]}
                    >
                        <Input.Password maxLength={30}/>
                    </Form.Item>

                    <Form.Item
                        label="State"
                        name="state"
                        style={{color: "#0E5F76"}}
                        rules={[
                            {
                                required: true,
                                message: 'Please select the state your venue is located!',
                                whitespace: true
                            }
                        ]}
                    >
                        <Select placeholder="Select State">
                            <Option value="qld">QLD</Option>
                            <Option value="nsw">NSW</Option>
                            <Option value="vic">VIC</Option>
                            <Option value="tas">TAS</Option>
                            <Option value="vic">SA</Option>
                            <Option value="vic">WA</Option>
                            <Option value="vic">NT</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Post Code"
                        name="postCode"
                        style={{color: "#0E5F76"}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input the post code of your venue!',
                                whitespace: true
                            }
                        ]}
                    >
                        <Input onChange={e => {numberInputs(e, form, 'postCode')}} maxLength={4} pattern="[a-zA-Z]*"/>     
                    </Form.Item>
                </Form>
            </div>

            <div style={{textAlign: 'center'}}>
                <Button type="primary" onClick={() => {handleSubmit(form)}}>Sign me up</Button>
                <span style={{color: "#0E5F76", paddingLeft: '15px'}}>Not you? <u style={{cursor: "pointer"}} onClick={() => { setUserState(USER_TYPE.UNREGISTERED)}}>Click here</u></span>
            </div> 
        </div>
    );
};

export default BusinessForm;