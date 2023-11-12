import axios from 'axios'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserContext from '../context/user/UserContext'
import 'react-toastify/dist/ReactToastify.css';

function SignIn() {
    const [emailId, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setAccessTokenForContext } = useContext(UserContext)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const userData = {
            emailId,
            password
        };
        console.log('process.env.REACT_APP_API_URL: ', process.env.REACT_APP_API_URL)

        axios.post(`${process.env.REACT_APP_API_URL}/user/login`, userData, config)
            .then((response) => {
                console.log(response.data);
                setAccessTokenForContext(response.data.accessToken)
                toast.success('Login successful!')
                navigate('/')
            })
            .catch((error) => {
                console.error("Error:", error);
                if (error.response && error.response.status === '400') {
                    const errorMessage = error.response.data;
                    toast.error(`Error: ${errorMessage}`);
                } else {
                    toast.error('An unexpected error occurred. Please try again.');
                }
            });
    };

    return (
        <div>
            <Navbar />
            <main className='profile'>
                <h3>SIGN IN</h3>
                <div className="profileInfo">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter emailId"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="text" // TODO: type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Button variant="btn btn-outline-danger" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </div>

                <div className="d-flex mt-3 justify-content-center">
                    <Button variant="outline-primary" type="submit" onClick={() => navigate('/sign-up')}>
                        Sign up
                    </Button>
                </div>
            </main>
        </div>
    )
}

export default SignIn
