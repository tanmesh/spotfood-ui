import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Navbar from '../components/Navbar'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AuthContext from '../context/auth/AuthContext';
import { TagsInput } from "react-tag-input-component";
import React, { useState, useContext, useEffect } from 'react'

function CreatePost() {
    const { getAccessTokenFromContext, setAccessTokenFromContext } = useContext(AuthContext);
    const [accessToken, setAccessToken] = useState(getAccessTokenFromContext());

    const [formData, setFormData] = useState({
        tags: [],
        latitude: '',
        longitude: '',
        encodedImgString: '',
        locationName: '',
    })

    const [selectedTags, setSelectedTags] = useState([]);

    const navigate = useNavigate()

    useEffect(() => {
        setAccessToken(getAccessTokenFromContext())

        console.log('accessToken: ', accessToken)

        if (accessToken === null) {
            console.log('accessToken is null')
            navigate('/sign-in')
            return;
        }
    }, [getAccessTokenFromContext()])

    const handleSubmit = (e) => {
        e.preventDefault()

        formData.tags = selectedTags

        console.log('Access token: ', accessToken)
        console.log('Formdata: ', formData)

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

    const convertFileToBase64 = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(file);
        });
    };

    const onMutate = async (e) => {
        console.log('Mutate: ', e)

        // Files
        if (e.target.files) {
            const base64Data = await convertFileToBase64(e.target.files[0])

            setFormData((prevState) => ({
                ...prevState,
                encodedImgString: base64Data,
            }))
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: e.target.value,
            }))
        }
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

                        <Form.Group className="mb-3" controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <TagsInput
                                value={selectedTags}
                                onChange={setSelectedTags}
                                name="tags"
                                placeHolder="Enter tag"
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
                        <Form.Group controlId="encodedImgString" className="mb-3">
                            <Form.Label>Upload </Form.Label>
                            <Form.Control
                                type="file"
                                accept='.jpg,.png,.jpeg'
                                onChange={onMutate} />
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
