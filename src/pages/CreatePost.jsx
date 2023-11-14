import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { TagsInput } from "react-tag-input-component";
import axios from 'axios'
import Navbar from '../components/Navbar'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import UserContext from '../context/user/UserContext';
import AWS from 'aws-sdk';
import Loading from '../shared/Loading';
import React, { useState, useContext, useEffect } from 'react'

function CreatePost() {
    const { getAccessTokenFromContext } = useContext(UserContext);
    const [geolocationEnabled, setGeolocationEnabled] = useState(true);
    const [address, setAddress] = useState('')
    const [imgFile, setImgFile] = useState(null)
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)

        console.log('accessToken: ', getAccessTokenFromContext())
        if (getAccessTokenFromContext() == 'null') {
            console.log('accessToken is null')
            navigate('/sign-in')
            return;
        }

        // use current location
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('location is enabled', position.coords)
                setGeolocationEnabled(true)
            },
            (error) => {
                setGeolocationEnabled(false)

            },
            options
        );

        setLoading(false)
    }, [])

    const [formData, setFormData] = useState({
        tagList: [],
        latitude: '',
        longitude: '',
        imgUrl: '',
        locationName: '',
    })

    // Upload to S3 bucket
    const uploadFile = async (imgFile) => {
        const S3_BUCKET = "spotfood-images";
        const fileType = '.jpeg';
        const key = imgFile.name + fileType; // The key or filename for your object in S3

        AWS.config.update({
            accessKeyId: `${process.env.REACT_APP_AWS_ACCESS_KEY}`,
            secretAccessKey: `${process.env.REACT_APP_AWS_SECRET_KEY}`,
        });

        const s3 = new AWS.S3({
            params: { Bucket: S3_BUCKET },
            region: `${process.env.REACT_APP_AWS_REGION}`,
        });

        const params = {
            Bucket: S3_BUCKET,
            Key: key, // Use the same key as you defined earlier
            Body: imgFile,
        };

        try {
            const upload = s3.upload(params).promise();
            const data = await upload;

            if (data) {
                const url = data.Location; // The URL of the uploaded file
                console.log("File uploaded successfully.");
                console.log("File URL:", url);

                return url
            } else {
                console.error("Error uploading file. Data is undefined.");
            }
        } catch (err) {
            console.error("Error uploading file:", err);
        }
    };

    // Handle geolocations
    const handleGeolocation = async () => {
        let geolocation = {
            latitude: '',
            longitude: '',
        }

        if (!geolocationEnabled) {
            // using address
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address.trim()}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`)
            const data = await response.json()

            let address_ = data.status === 'ZERO_RESULTS' ? 'undefined' : data.results[0]?.formatted_address

            if (address_ === 'undefined' || address_.includes('undefined')) {
                toast.error('Please enter correct address!')
                return;
            }

            geolocation.latitude = data.results[0]?.geometry.location.lat ?? 0
            geolocation.longitude = data.results[0]?.geometry.location.lng ?? 0

            setAddress(address_)
        } else {
            // using current location
            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
            };
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve(position.coords);
                    },
                    (error) => {
                        reject(error);
                    },
                    options
                );
            });

            geolocation.longitude = position.longitude
            geolocation.latitude = position.latitude
        }

        return geolocation
    }

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)

        const geolocation_ = (await Promise.all([handleGeolocation()]))[0]
        const imgUrl = (await Promise.all([uploadFile(imgFile)]))[0]

        console.log('geolocation_: ', geolocation_)
        console.log('imgUrl: ', imgUrl)

        const formDataCopy = {
            ...formData,
            latitude: geolocation_.latitude,
            longitude: geolocation_.longitude,
            tagList: selectedTags,
            imgUrl,
        }

        console.log('Access token: ', getAccessTokenFromContext())
        console.log('formDataCopy: ', formDataCopy)

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getAccessTokenFromContext(),
            },
        };

        axios.post(`${process.env.REACT_APP_API_URL}/user_post/add`, formDataCopy, config)
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

        setLoading(false)
    }

    const onMutate = async (e) => {
        if (e.target.files) {
            setImgFile(e.target.files[0])
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
                {loading && <Loading />}

                <h3>Create new post</h3>
                <div className="profileInfo">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="locationName">
                            <Form.Label>Restaurant name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter restaurant name"
                                onChange={onMutate}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <TagsInput
                                value={selectedTags}
                                onChange={setSelectedTags}
                                name="tags"
                                placeHolder="Enter tag"
                                required
                            />
                        </Form.Group>

                        {!geolocationEnabled &&
                            (
                                <Form.Group className="mb-3" controlId="address">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter restaurant address"
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            )}

                        {/* TODO: 
                        1. upload from camera
                        2. multiple uploads */}
                        <Form.Group controlId="encodedImgString" className="mb-3">
                            <Form.Label>Upload </Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                accept='.jpg,.png,.jpeg'
                                onChange={onMutate}
                                required />
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
