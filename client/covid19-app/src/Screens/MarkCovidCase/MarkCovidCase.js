import { Form, Input, Button } from 'antd';
import { layout, tailLayout } from './layouts';
const MarkCovidCase =() => {
    return(
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>Mark person COVID Positive</h1>
            </div>
            

            
            <div>
                <h1 style={{marginTop:"5%" ,textAlign:'Center',fontWeight:'normal',color: "#0E5F76"}}>
                    <span >Mark a patient as positive with</span>
                    <br/>
                    <span >COVID-19 for contact Tracing</span> 
                </h1>
            </div>

            <Form {...layout}>
            <Form.Item
                    label="Email Address of Patient :"
                    name="email"
                    style={{color: "#0E5F76"}}
                    rules={[
                    {   
                        type: 'email',
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
                    label="Date First tested positive :"
                    name="date"
                    style={{color: "#0E5F76"}}
                    rules={[
                    {   
                        type: 'date',
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
                    <Button style={{backgroundColor: "#0E5F76",color:"white"}}>Mark individual as positive</Button>
                    
                </Form.Item>

            </Form>

        </div>
    );
}

export default MarkCovidCase;