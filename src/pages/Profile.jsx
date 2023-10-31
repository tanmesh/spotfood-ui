import axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import Navbar from '../components/Navbar'
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import AuthContext from '../context/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// TODO: set loading 

function Profile() {
    const { getAccessTokenFromContext, setAccessTokenFromContext } = useContext(AuthContext);
    const [accessToken, setAccessToken] = useState(getAccessTokenFromContext());
    // eslint-disable-next-line
    const [firstName, setFirstName] = useState('');
    // eslint-disable-next-line
    const [lastName, setLastName] = useState('');
    // eslint-disable-next-line
    const [emailId, setEmail] = useState('');
    // eslint-disable-next-line
    const [password, setPassword] = useState('');
    const profilePicUrl = 'https://sm.ign.com/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.jpg'
    const [profile, setProfile] = useState({
        emailId: '',
        firstName: '',
        lastName: '',
        followTagList: [],
        followersList: [],
        nickName: '',
        lastUpdatedLocation: '',
        password: '',
    })
    const navigate = useNavigate()

    useEffect(() => {
        setAccessToken(getAccessTokenFromContext())

        console.log('accessToken: ', accessToken)

        if (accessToken === null) {
            console.log('accessToken is null')
            navigate('/sign-in')
            return;
        }

        const fetchProfile = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            };

            axios.get('http://localhost:39114/user/profile', config)
                .then((response) => {
                    setProfile(response.data)
                    console.log(response.data)
                })
                .catch((error) => {
                    console.error("Error:", error);
                    navigate('/sign-in')
                });
        }
        fetchProfile()
    }, [navigate, getAccessTokenFromContext, accessToken])

    const handleSubmit = (e) => {
        e.preventDefault();
        // const userData = {
        //     firstName,
        //     lastName,
        //     emailId,
        //     password,
        // };
    };

    /*  
        TODO: Not working 
    */
    // Handling logout 
    const handleLogout = (e) => {
        console.log(accessToken);

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': accessToken,
            },
        };

        axios.post('http://localhost:39114/user/logout', '', config)
            .then((response) => {
                console.log(response.data);
                setAccessTokenFromContext(null)
                toast.success('Logout successful!')
                navigate('/')
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error('An unexpected error occurred. Please try again.');
            });
    };

    return (
        <div>
            <Navbar />
            <main className='profile'>
                {/* TODO: add edit option itself on the img */}
                <img src={profilePicUrl} alt="avatar" style={{
                    width: "100px",
                    borderRadius: "50%",
                }} />

                {/* TOOD:  add cross to remove tags  */}
                <div className='ml-2 mr-1 mt-2'>
                    <Stack direction="horizontal" gap={2} className='cardDiv'>
                        {profile.followTagList.map((tag) => (
                            <Badge bg="primary">{tag}</Badge>
                        ))}
                    </Stack>
                </div>

                <div className="profileInfo">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter first name"
                                value={profile.firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter last name"
                                value={profile.lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="emailId">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter emailId"
                                value={profile.emailId}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="text" // TODO: type="password"
                                placeholder="Password"
                                value={profile.password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        {/*
                        TODO: 
                            1. add tags options
                        */}
                        <Form.Group className="mb-3" controlId="tags">
                            <Form.Label>Tags </Form.Label>
                            <Stack direction="horizontal" gap={2} className='cardDiv'>
                                {profile.followTagList.map((tag) => (
                                    <Badge bg="primary">{tag}</Badge>
                                ))}
                            </Stack>
                        </Form.Group>

                        <Form.Group controlId="avatar" className="mb-3">
                            <Form.Label>Upload new avatar</Form.Label>
                            <Form.Control type="file" />
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Button variant="btn btn-outline-dark" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </div>

                <div className="d-flex mt-3 justify-content-center">
                    <Button variant="btn btn btn-danger" type="submit" onClick={() => handleLogout()}>
                        Log out
                    </Button>
                </div>
            </main>
        </div>
    )
}

export default Profile
