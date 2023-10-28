import axios from 'axios'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserContext from '../context/user/UserContext';
import 'react-toastify/dist/ReactToastify.css';

function SignIn() {
    const [emailId, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const { setAccesstoken } = useContext(UserContext)

    const handleSubmit = (e) => {
        e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const userData = {
            emailId,
            password,
        };

        axios.post('http://localhost:39114/user/login', userData, config)
            .then((response) => {
                console.log(response.data);
                setAccesstoken(response.data.accessToken)
                toast.success('Login successful!')
                navigate('/')
            })
            .catch((error) => {
                console.error("Error:", error);
                if (error.response && error.response.status === '400') {
                    // Handle the 400 Bad Request error specifically
                    // You can access the error response data for more details
                    const errorMessage = error.response.data; // This might be "user not found" or similar
                    toast.error(`Error: ${errorMessage}`);
                } else {
                    // Handle other types of errors
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
