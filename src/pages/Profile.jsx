import axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import Navbar from '../components/Navbar'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserContext from '../context/user/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Profile() {
    const { accessToken, setAccesstoken } = useContext(UserContext)

    const [profile, setProfile] = React.useState({
        emailId: '',
        firstName: '',
        lastName: '',
        followTagList: [],
        followersList: [],
        nickName: '',
        lastUpdatedLocation: '',
        password: '',
    })

    // TODO: set loading 

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailId, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const profilePicUrl = 'https://sm.ign.com/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.jpg'

    const navigate = useNavigate()

    useEffect(() => {
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
                })
                .catch((error) => {
                    console.error("Error:", error);
                    navigate('/sign-in')
                });
        }
        fetchProfile()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            firstName,
            lastName,
            emailId,
            password,
        };
        console.log(userData);
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
                setAccesstoken(null)
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
                <div>
                    {/* TODO: add edit option itself on the img */}
                    <img src={profilePicUrl} alt="avatar" style={{
                        width: "100px",
                        borderRadius: "50%",
                    }} />

                </div>
                <div className="profileInfo">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter first name"
                                value={profile.firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter last name"
                                value={profile.lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
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

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="text" // TODO: type="password"
                                placeholder="Password"
                                value={profile.password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formFile" className="mb-3">
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
