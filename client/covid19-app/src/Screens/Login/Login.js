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
            <div style={{textAlign: 'center', padding: '2%'}}>
                <h1>User Login Example</h1>
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
                    rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
        
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
        
            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
            </Form>
        </div>
      );
}

export default Login;