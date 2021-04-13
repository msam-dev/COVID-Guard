import { Form, Input, Button } from 'antd';
import { layout, tailLayout } from './layouts';




const Login = () => {

    const onFinish = values => {
        console.log('Success:', values);
    };
    
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    
    return (
        <div>
            <div style={{textAlign: 'center', padding: '1%'}}>
                <h1 style={{color: "#0E5F76"}}>COVID Guard Login</h1>
            </div>

            <Form
                {...layout}
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    style={{color: "#0E5F76"}}
                    rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                        whitespace: true
                    },
                    ]}
                >
                    <Input maxLength={30}/>
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
                    },
                    ]}
                >
                    <Input.Password maxLength={30}/>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                    <span style={{paddingLeft: "19%", color: "#0E5F76"}}>Not Registered? <a href="/login"><u>Click here</u></a></span>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <span style={{color: "#0E5F76"}}>Forgot Password? <a href="/login"><u>Click here</u></a></span>
                </Form.Item>
            </Form>
        </div>
      );
}

export default Login;