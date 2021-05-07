import { Form, Input, Button } from 'antd';
import { useState } from 'react';
import { layout, tailLayout } from './layouts';
import { VACCINE_STATE } from './VaccineStates';
import { CheckOutlined, RiseOutlined, CloseOutlined } from '@ant-design/icons';

const CheckVaccStatus = () => {
    const [vaccinationRecord] = useState({});

    return (
        <div>
            <h1 style = {{color: "#0E5F76", textAlign: "left", backgroundColor: "#FDC500", paddingLeft: "1%"}}>Check Vaccination Status</h1>
            <h1 style = {{color: "#0E5F76", padding: "2%", textAlign: "center"}}>Check Vaccination Status</h1>

            <Form
                {...layout}
                name="basic"
            >
                <Form.Item
                        label="Code"
                        name="code"
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: 'Please input a valid vaccination code!',
                                validateTrigger: 'onSubmit'
                            },
                        ]}
                
                >   
                    <Input placeholder="Enter vaccination code here" maxLength={50}/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">Check Status</Button>
                </Form.Item>
            </Form>
            
            <div style={{textAlign: 'center'}}>
                {
                    vaccinationRecord.vaccinationStatus === VACCINE_STATE.Complete
                    ?
                    <div>
                        <span style={{color: "#0E5F76"}}>Complete </span>
                        <CheckOutlined style={{fontSize: '30px', color: 'green'}} />
                    </div>
                    :
                    vaccinationRecord.vaccinationStatus === VACCINE_STATE.Partial
                    ?
                    <div>
                        <span style={{color: "#0E5F76"}}>Partial </span>
                        <RiseOutlined style={{fontSize: '30px', color: '#FDC500'}} />
                    </div>
                    :
                    vaccinationRecord.vaccinationStatus === VACCINE_STATE.NoVaccination
                    ?
                    <div>
                        <span style={{color: "#0E5F76"}}>Not Vaccinated </span>
                        <CloseOutlined style={{fontSize: '30px', color: 'red'}} />
                    </div>
                    : 
                    <></>
                }
            </div>
        </div>
    );
};

export default CheckVaccStatus;

