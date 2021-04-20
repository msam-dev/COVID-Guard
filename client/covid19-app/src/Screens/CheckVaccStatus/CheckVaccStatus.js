import { Form, Input, Button } from 'antd';
import { layout, tailLayout } from './layouts';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';

const CheckVaccStatus = () => {

    const dbSearchReturnData = {"name": "", "code": ""};
    const testData = [  {"name": "big man a", "code": "123"}, 
                        {"name": "big man b", "code": "456"}, 
                        {"name": "big man c", "code": "789"}]

    const showSuccessfulVac = value => {
        console.log("Code:", value, " has been submitted.");
        testData.forEach(dbSimCode => testForCodeEquivalence(dbSimCode.code, value))
    };

    const testForCodeEquivalence = (dbSimCode, formVal) => {
        if (dbSimCode === formVal.code) {
            console.log("A match has been found.");
            dbSearchReturnData.name = dbSimCode.name;
            dbSearchReturnData.code = dbSimCode.code;
            console.log(dbSearchReturnData);
            console.log(dbSimCode);
            document.getElementById("vaccResultString").innerHTML = dbSearchReturnData.name + " has been vaccinated!"
        }
    }
    
    const showFailedVac = errorInfo => {
        console.log("Failed:", errorInfo);
    };

    return (
        <div style={{color: "#0E5F76"}}>

            <div id="navbar-wrapper">
                <Navbar />
            </div>

            <h1 style = {{color: "#0E5F76", textAlign: "left", backgroundColor: "#FDC500", paddingLeft: "1%"}}>Check Vaccination Status</h1>
            <h1 style = {{color: "#0E5F76", padding: "2%", textAlign: "center"}}>Check Civilian Vaccination Status</h1>

            <Form
                {...layout}
                name="basic"
                onFinish={showSuccessfulVac}
                onFinishFailed={showFailedVac}
            >
                <Form.Item
                        label="Code"
                        name="code"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your vaccination code.',
                        },
                        ]}
                
                >   
                <Input/>

                </Form.Item>
            
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">Search</Button>
                </Form.Item>
            </Form>

            <div id="vaccResultString"></div>

            <div id="footer-wrapper">
                <Footer />
            </div>

        </div>

    );
};

export default CheckVaccStatus;

