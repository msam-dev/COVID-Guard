import { layout, tailLayout } from './layouts';
import {Form, Radio, DatePicker, Input, Button} from 'antd'; 
import { VACCINE_TYPES } from './VaccineTypes';




const ConfirmUserVaccination = () => {



    return(
        <div>
            <h1 style = {{color: "#0E5F76", textAlign: "left", backgroundColor: "#FDC500", paddingLeft: "1%"}}>Confirm User Vaccination</h1>
            <h1 style = {{color: "#0E5F76", padding: "2%", textAlign: "center"}}>Confirm Vaccination Status of General Public Memeber</h1>

            <div>
                <Form
                    {...layout}
                >
                    <Form.Item
                        label="Patient Email"
                        name="email"
                        style={{color: "#0E5F76"}}
                        rules={[
                        {   
                            type: 'email',
                            required: true,
                            message: 'Email does not appear to be valid!',
                            whitespace: true,
                            validateTrigger: 'onSubmit'
                        },
                        ]}
                    >
                        <Input maxLength={50}/>
                    </Form.Item>

                    <Form.Item
                        {...layout}
                        label="Date of Vaccination"
                        name="vaccinationDate"
                        rules={[
                            {
                                required: true,
                                message: "Please select date patient was vaccinated!"
                            }
                        ]}
                    >
                        <DatePicker/>
                    </Form.Item>

                    <Form.Item 
                        {...layout} 
                        name="vaccineType"
                        label="Vaccine Type" 
                        rules={[
                            { 
                                required: true,
                                message: 'Please select which vaccine was administered!'
                            }
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={VACCINE_TYPES.AstraZeneca}>{VACCINE_TYPES.AstraZeneca}</Radio>
                            <Radio value={VACCINE_TYPES.Novavax}>{VACCINE_TYPES.Novavax}</Radio>
                            <Radio value={VACCINE_TYPES.Pfizer}>{VACCINE_TYPES.Pfizer}</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default ConfirmUserVaccination;