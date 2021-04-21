import { Form, Input, Button } from 'antd';
import { layout, tailLayout } from './layouts';
import PATH from '../../_constants/paths';
import { useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { useAuthUpdate } from '../../Components/AuthContext/AuthContext';
import { _login } from '../../_helpers/endPoints';
import { isWhiteSpace, validateEmail } from '../../_helpers/sharedFunctions';
import history from '../../_helpers/history';




const Login = () => {
    const [loading, setLoading] = useState(false);
    const [form] = useForm();
    const updateAuth = useAuthUpdate();

 


    const onFinish = () => {
        console.log("SUCCESS");
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const login = (_, password) => {
        const email = form.getFieldValue('email');

        if (!password || isWhiteSpace(password) || !validateEmail(email)) return Promise.resolve();

        setLoading(true);

        const user = {
            email: email,
            password: password,
        }

        return _login(user)
        .then(res => {
            console.log(res);
            setLoading(false); 
            localStorage.setItem('USER', JSON.stringify(res.data));
            updateAuth(res.data);
            history.push(PATH.home);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
            throw new Error("Email or password details were incorrect");
        });
    }
    




    return (
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>Login</h1>
            </div>
            
            <div style={{textAlign: 'center', padding: '1%'}}>
                <h1 style={{color: "#0E5F76"}}>COVID Guard Login</h1>
            </div>

            <Form
                form={form}
                {...layout}
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Email"
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
                    label="Password"
                    name="password"
                    style={{color: "#0E5F76"}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                            whitespace: true
                        },
                     
                        {
                            validator: login,
                            validateTrigger: "onSubmit"
                        }
                    ]}
                >
                    <Input.Password maxLength={30}/>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button loading={loading} type="primary" htmlType="submit">Login</Button>
                    <span style={{paddingLeft: "19%", color: "#0E5F76"}}>Not Registered? <a href={PATH.register}><u>Click here</u></a></span>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <span style={{color: "#0E5F76"}}>Forgot Password? <a href="/login"><u>Click here</u></a></span>
                </Form.Item>
            </Form>
        </div>
      );
}

export default Login;