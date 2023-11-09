import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import Navbar from '../components/Navbar'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react'

/*
    TODO:
        show password
*/

function SignUp() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nickName: '',
        emailId: '',
        password: '',
    })

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        axios.post('http://localhost:39114/user/signup', formData, config)
            .then((response) => {
                console.log(response.data);
                toast.success('Signup successful!')
                navigate('/sign-in')
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
    }

    const onMutate = (e) => {
        e.preventDefault()
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    return (
        <div>
            <Navbar />
            <main className='profile'>
                <h3>SIGN UP</h3>
                <div className="profileInfo">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="your first name"
                                onChange={onMutate}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="your last name"
                                onChange={onMutate}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="nickName">
                            <Form.Label>Avatar name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="your avatar name"
                                onChange={onMutate}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="emailId">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="your emailId"
                                onChange={onMutate}
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="text" // TODO: type="password"
                                placeholder="your password"
                                onChange={onMutate}
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
                    <Button variant="outline-primary" type="submit" onClick={() => navigate('/sign-in')}>
                        Go back
                    </Button>
                </div>
            </main>
        </div>
    )
}

export default SignUp
