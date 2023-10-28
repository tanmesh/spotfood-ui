import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Navbar from '../components/Navbar'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import UserContext from '../context/user/UserContext';
import React, { useState, useContext } from 'react'

function CreatePost() {
    const [formData, setFormData] = useState({
        tags: [],
        latitude: '',
        longitude: '',
        foodImage: '',
        locationName: '',
    })

    const navigate = useNavigate()
    const { accessToken } = useContext(UserContext)

    const handleSubmit = (e) => {
        e.preventDefault()

        console.log(formData)   

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': accessToken,
            },
        };

        axios.post('http://localhost:39114/user_post/add', formData, config)
            .then((response) => {
                console.log(response.data);
                toast.success('Upload successful!')
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
                <h3>Create new post</h3>
                <div className="profileInfo">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="locationName">
                            <Form.Label>Restaurant name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter restaurant name"
                                onChange={onMutate}
                            />
                        </Form.Group>

                        {/* TODO: taking multiple tags  */}
                        <Form.Group className="mb-3" controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter tag"
                                onChange={onMutate}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="latitude">
                            <Form.Label>Latitude</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter latitude"
                                onChange={onMutate}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="longitude">
                            <Form.Label>Longitude</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter longitude"
                                onChange={onMutate}
                            />
                        </Form.Group>

                        {/* TODO: upload from camera */}
                        <Form.Group controlId="foodImage" className="mb-3">
                            <Form.Label>Upload </Form.Label>
                            <Form.Control type="file" accept='.jpg,.png,.jpeg' />
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Button variant="btn btn-outline-dark" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </div>
            </main>
        </div>
    )
}

export default CreatePost
